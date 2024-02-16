import { Fab, Tooltip, useTheme } from '@mui/material';
import { Box, IconButton, InputAdornment, TextField, Stack } from '@mui/material';
import { Camera, File, Image, LinkSimple, PaperPlaneTilt, Smiley, Sticker, User } from 'phosphor-react';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useSelector } from 'react-redux';
import { socket } from '../../socket';

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

const ChatInput = ({ openPicker, setOpenPicker, setValue, value }) => {
    const [openActions, setOpenActions] = React.useState(false);
    const handleClickAway = () => {
        setOpenActions(false);
    };
    const handleClickAwayPicker = () => {
        setOpenPicker(false);
    };

    return (
        <StyledInput
            value={value}
            onChange={(event) => {
                setValue(event.target.value);
            }}
            fullWidth
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

const Footer = () => {
    const theme = useTheme();
    const [openPicker, setOpenPicker] = useState(false);
    const [value, setValue] = useState('');
    const { current_conversation } = useSelector((state) => state.conversation);
    const { sideBar, room_id } = useSelector((state) => state.app);
    const user_id = window.localStorage.getItem('user_id');

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
            <Stack direction="row" alignItems={'center'} spacing={3}>
                <Stack sx={{ width: '100%' }}>
                    <ClickAwayListener
                        mouseEvent="onMouseDown"
                        // touchEvent="onTouchStart"
                        onClickAway={handleClickAwayPicker}
                    >
                        <Box
                            sx={{
                                display: openPicker ? 'inline' : 'none',
                                zIndex: 10,
                                position: 'fixed',
                                bottom: 81,
                                right: 100,
                            }}
                        >
                            <Picker theme={theme.palette.mode} data={data} onEmojiSelect={console.log} />
                        </Box>
                    </ClickAwayListener>
                    <ChatInput
                        openPicker={openPicker}
                        setOpenPicker={setOpenPicker}
                        value={value}
                        setValue={setValue}
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
                        <IconButton
                            onClick={() => {
                                socket.emit('text_message', {
                                    message: linkify(value),
                                    conversation_id: room_id,
                                    from: user_id,
                                    to: current_conversation.user_id,
                                    type: containsUrl(value) ? 'LINK' : 'TEXT',
                                });
                            }}
                        >
                            <PaperPlaneTilt color="white" />
                        </IconButton>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};

export default Footer;
