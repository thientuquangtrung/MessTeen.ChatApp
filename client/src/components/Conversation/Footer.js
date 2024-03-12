import { Fab, Tooltip, Typography, useTheme } from '@mui/material';
import { Box, IconButton, InputAdornment, TextField, Stack } from '@mui/material';
import { Camera, File, Image, LinkSimple, PaperPlaneTilt, Smiley, Sticker, User, X } from 'phosphor-react';
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../socket';
import { CloseReplyMessage, SendMultimedia } from '../../redux/conversation/convActionCreators';
import { dispatch } from '../../redux/store';
import { showSnackbar } from '../../redux/app/appActionCreators';
import useResponsive from '../../hooks/useResponsive';

const StyledInput = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-input': {
        paddingTop: '12px !important',
        paddingBottom: '12px !important',
    },
}));

const ChatInput = ({
    openPicker,
    setOpenPicker,
    setValue,
    value,
    sendMessage,
    inputRef,
    selectedFiles,
    setSelectedFiles,
}) => {
    const [openActions, setOpenActions] = React.useState(false);

    const dispatch = useDispatch();
    const inputRef1 = useRef(null);
    const handleClickAway = () => {
        setOpenActions(false);
    };

    const handleSelectFile = (event) => {
        const files = event.target.files;
        const nonImageFile = Array.from(files).find((file) => !file.type.startsWith('image/'));

        if (nonImageFile) {
            dispatch(
                showSnackbar({
                    severity: 'error',
                    message: `Invalid file type: ${nonImageFile.type}. Please select an image file.`,
                }),
            );
        } else {
            setSelectedFiles([...files]);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <StyledInput
            inputRef={inputRef}
            value={value}
            onChange={(event) => {
                setValue(event.target.value);
            }}
            fullWidth
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
            variant="filled"
            InputProps={{
                disableUnderline: true,
                startAdornment: (
                    <Stack sx={{ width: '30px' }}>
                        <InputAdornment>
                            <IconButton onClick={() => inputRef1.current.click()}>
                                <Stack justifyContent={'center'} alignItems={'center'}>
                                    <Tooltip placement="top" title={'Image'}>
                                        <Stack
                                            sx={{
                                                position: 'absolute',
                                            }}
                                        >
                                            <Image size={24} />
                                        </Stack>
                                    </Tooltip>
                                    <input
                                        ref={inputRef1}
                                        type="file"
                                        onChange={handleSelectFile}
                                        style={{ display: 'none' }}
                                        accept={'image/*'}
                                    />
                                </Stack>
                            </IconButton>
                        </InputAdornment>
                    </Stack>
                ),
                endAdornment: (
                    <Stack sx={{ position: 'relative' }}>
                        <InputAdornment>
                            <IconButton
                                onClick={() => {
                                    setOpenPicker(!openPicker);
                                }}
                            >
                                <Smiley />
                            </IconButton>
                        </InputAdornment>
                    </Stack>
                ),
            }}
        />
    );
};

function linkify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
}

function containsUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
}

const user_id = window.localStorage.getItem('user_id');

const Footer = () => {
    const theme = useTheme();
    const [openPicker, setOpenPicker] = useState(false);
    const [value, setValue] = useState('');
    const { current_conversation } = useSelector((state) => state.conversation);

    const { replyMsg } = useSelector((state) => state.conversation);
    const { blockedFriends } = useSelector((state) => state.app);
    const isBlocked = blockedFriends.includes(current_conversation?.user_id);

    const { room_id } = useSelector((state) => state.app);
    const inputRef = useRef(null);
    const handleEmojiSelect = (emoji) => {
        setValue(value + emoji.native);
    };
    const [selectedFiles, setSelectedFiles] = useState([]);

    const isMobile = useResponsive('between', 'md', 'xs', 'sm');

    const { sidebar } = useSelector((state) => state.app);


    const sendMessage = () => {
        if (current_conversation?.isBeingBlocked) {
            dispatch(showSnackbar({ severity: 'info', message: ' You cannot text or call in this chat.' }));
        } else {
            let messageToSend = value.trim();
            if (messageToSend?.length > 500) {
                dispatch(showSnackbar({ severity: 'warning', message: `Message must less than 500 characters` }));
                return;
            }
            if (messageToSend !== '' || selectedFiles.length > 0) {
                if (replyMsg) {
                    if (selectedFiles.length > 0) {
                        dispatch(
                            SendMultimedia(selectedFiles, (downloadURL) => {
                                socket.emit('text_message', {
                                    message: linkify(messageToSend),
                                    conversation_id: room_id,
                                    from: user_id,
                                    to: current_conversation.user_id,
                                    type: 'IMAGE',
                                    msg_parent_id: replyMsg.id,
                                    fileURL: downloadURL,
                                });
                            }),
                        );
                    } else {
                        socket.emit('text_message', {
                            message: linkify(messageToSend),
                            conversation_id: room_id,
                            from: user_id,
                            to: current_conversation.user_id,
                            type: containsUrl(messageToSend) ? 'LINK' : 'TEXT',
                            msg_parent_id: replyMsg.id,
                        });
                    }
                    dispatch(CloseReplyMessage());
                } else {
                    if (selectedFiles.length > 0) {
                        dispatch(
                            SendMultimedia(selectedFiles, (downloadURL) => {
                                socket.emit('text_message', {
                                    message: linkify(messageToSend),
                                    conversation_id: room_id,
                                    from: user_id,
                                    to: current_conversation.user_id,
                                    type: 'IMAGE',
                                    fileURL: downloadURL,
                                });
                            }),
                        );
                    } else {
                        socket.emit('text_message', {
                            message: linkify(messageToSend),
                            conversation_id: room_id,
                            from: user_id,
                            to: current_conversation.user_id,
                            type: containsUrl(messageToSend) ? 'LINK' : 'TEXT',
                        });
                    }
                }
                setSelectedFiles([]);
                setValue('');
                inputRef.current.focus();
            }
        }
    };

    const handleClickAwayPicker = () => {
        setOpenPicker(false);
    };

    return (
        <Box
            p={isMobile ? 1 : 2}
            width={'100%'}
            sx={{
                backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
                boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
            }}
        >
            {isBlocked ? (
                <Typography variant="body1" color="textSecondary" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                    You cannot text or call in this chat.
                </Typography>
            ) : (
                <>
                    {replyMsg && (
                        <Stack
                            sx={{
                                backgroundColor: 'white',
                                width: '100%',
                                height: 'auto',
                                padding: '10px',
                                marginBottom: '5px',
                            }}
                        >
                            <Stack direction={'row-reverse'} justifyContent="space-between" height={'auto'}>
                                <IconButton
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                    onClick={() => dispatch(CloseReplyMessage())}
                                >
                                    <X fontSize={16} />
                                </IconButton>
                                <Typography variant="h6" style={{ fontSize: '14px' }}>
                                    Đang trả lời ...
                                </Typography>
                            </Stack>

                            <Typography>{replyMsg?.content}</Typography>
                        </Stack>
                    )}
                    {selectedFiles.length > 0 && (
                        <Stack
                            direction={'row'}
                            sx={{
                                backgroundColor: '#919eab1f',
                                width: 'auto',
                                height: 'auto',
                                padding: '10px',
                                marginBottom: '10px',
                            }}
                        >
                            {selectedFiles.map((file, index) => (
                                <Stack position={'relative'} key={index} marginRight={'15px'}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="Selected File"
                                        style={{ width: '70px', height: '70px' }}
                                    />
                                    <IconButton
                                        style={{
                                            position: 'absolute',
                                            top: -13,
                                            right: -13,
                                        }}
                                        onClick={() => {
                                            const updatedFiles = [...selectedFiles];
                                            updatedFiles.splice(index, 1);
                                            setSelectedFiles(updatedFiles);
                                        }}
                                    >
                                        <Stack
                                            sx={{
                                                backgroundColor: 'white',
                                                height: '20px',
                                                width: '20px',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <X fontSize={15} />
                                        </Stack>
                                    </IconButton>
                                </Stack>
                            ))}
                        </Stack>
                    )}
                    <Stack direction="row" alignItems={'center'} spacing={isMobile ? 1 : 3}>
                        <Stack sx={{ width: '100%' }} justifyContent={'flex-end'}>
                            <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleClickAwayPicker}>
                                <Box
                                    sx={{
                                        display: openPicker ? 'inline' : 'none',
                                        zIndex: 10,
                                        position: 'fixed',
                                        bottom: 81,
                                        right: isMobile ? 20 : sidebar.open ? 420 : 100,
                                    }}
                                >
                                    <Picker
                                        theme={theme.palette.mode}
                                        data={data}
                                        onEmojiSelect={(emoji) => handleEmojiSelect(emoji)}
                                    />
                                </Box>
                            </ClickAwayListener>
                            <ChatInput
                                openPicker={openPicker}
                                setOpenPicker={setOpenPicker}
                                value={value}
                                setValue={setValue}
                                sendMessage={sendMessage}
                                inputRef={inputRef}
                                selectedFiles={selectedFiles}
                                setSelectedFiles={setSelectedFiles}
                            />
                        </Stack>

                        <Box
                            sx={{
                                height: 48,
                                width: 48,
                                backgroundColor: theme.palette.primary.main,
                                borderRadius: 1.5,
                            }}
                        >
                            <Stack sx={{ height: '100%', width: '100%' }} alignItems="center" justifyContent="center">
                                {' '}
                                <IconButton onClick={sendMessage}>
                                    <PaperPlaneTilt color="white" />
                                </IconButton>
                            </Stack>
                        </Box>
                    </Stack>
                </>
            )}
        </Box>
    );
};

export default Footer;
