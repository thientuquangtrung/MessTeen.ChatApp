import { Fab, Tooltip, Typography, useTheme } from '@mui/material';
import { Box, IconButton, InputAdornment, TextField, Stack } from '@mui/material';
import { Camera, File, Image, LinkSimple, PaperPlaneTilt, Smiley, Sticker, User, X } from 'phosphor-react';
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useSelector } from 'react-redux';
import { socket } from '../../socket';
import { CloseReplyMessage, FetchCurrentMessages } from '../../redux/conversation/convActionCreators';
import { dispatch } from '../../redux/store';
import { FetchDirectConversations } from '../../redux/conversation/convActionCreators';
import { showSnackbar } from '../../redux/app/appActionCreators';

const StyledInput = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-input': {
        paddingTop: '12px !important',
        paddingBottom: '12px !important',
    },
}));

const Actions = [
    {
        color: '#4da5fe',
        icon: <Image size={24} />,
        y: 102,
        title: 'Photo/Video',
    },
    {
        color: '#1b8cfe',
        icon: <Sticker size={24} />,
        y: 172,
        title: 'Stickers',
    },
    {
        color: '#0172e4',
        icon: <Camera size={24} />,
        y: 242,
        title: 'Image',
    },
    {
        color: '#0159b2',
        icon: <File size={24} />,
        y: 312,
        title: 'Document',
    },
    {
        color: '#013f7f',
        icon: <User size={24} />,
        y: 382,
        title: 'Contact',
    },
];

const ChatInput = ({ openPicker, setOpenPicker, setValue, value, sendMessage, inputRef }) => {
    const [openActions, setOpenActions] = React.useState(false);
    const handleClickAway = () => {
        setOpenActions(false);
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
                    <Stack sx={{ width: 'max-content' }}>
                        <Stack
                            sx={{
                                position: 'relative',
                                display: openActions ? 'inline-block' : 'none',
                            }}
                        >
                            {Actions.map((el) => (
                                <Tooltip placement="right" title={el.title}>
                                    <Fab
                                        onClick={() => {
                                            setOpenActions(!openActions);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: -el.y,
                                            backgroundColor: el.color,
                                        }}
                                        aria-label="add"
                                    >
                                        {el.icon}
                                    </Fab>
                                </Tooltip>
                            ))}
                        </Stack>

                        <InputAdornment>
                            <ClickAwayListener onClickAway={handleClickAway}>
                                <IconButton
                                    onClick={() => {
                                        setOpenActions(!openActions);
                                    }}
                                >
                                    <LinkSimple />
                                </IconButton>
                            </ClickAwayListener>
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

    const { sideBar, room_id } = useSelector((state) => state.app);
    const inputRef = useRef(null);
    const handleEmojiSelect = (emoji) => {
        setValue(value + emoji.native);
    };

    const sendMessage = () => {
        if (current_conversation.isBeingBlocked) {
            dispatch(showSnackbar({ severity: 'info', message: ' You cannot text or call in this chat.' }));
        } else {
            let messageToSend = value.trim();
            if (messageToSend !== '') {
                if (replyMsg) {
                    socket.emit('text_message', {
                        message: linkify(messageToSend),
                        conversation_id: room_id,
                        from: user_id,
                        to: current_conversation.user_id,
                        type: containsUrl(messageToSend) ? 'LINK' : 'TEXT',
                        msg_parent_id: replyMsg.id,
                    });
                    dispatch(CloseReplyMessage());
                } else {
                    socket.emit('text_message', {
                        message: linkify(messageToSend),
                        conversation_id: room_id,
                        from: user_id,
                        to: current_conversation.user_id,
                        type: containsUrl(messageToSend) ? 'LINK' : 'TEXT',
                    });
                }
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
            p={2}
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

                    <Stack direction="row" alignItems={'center'} spacing={3}>
                        <Stack sx={{ width: '100%' }}>
                            <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleClickAwayPicker}>
                                <Box
                                    sx={{
                                        display: openPicker ? 'inline' : 'none',
                                        zIndex: 10,
                                        position: 'fixed',
                                        bottom: 81,
                                        right: 100,
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
