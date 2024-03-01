import React from 'react';
import { ThemeContext } from '@emotion/react';
import { Avatar, Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import { Bell, CaretLeft, Image, Info, Key, Keyboard, Lock, Note, PencilCircle } from 'phosphor-react';
import { faker } from '@faker-js/faker';
import { useSelector } from 'react-redux';

const Settings = () => {
    const navigate = useNavigate();

    const theme = useTheme();

    const { user } = useSelector((state) => state.app);

    const handleBackToApp = () => {
        navigate('/app');
    };

    const list = [
        {
            key: 0,
            icon: <Bell size={20} />,
            title: 'Notification',
            onclick: () => {},
            disabled: true,
        },
        {
            key: 1,
            icon: <Lock size={20} />,
            title: 'Privacy',
            onclick: () => navigate('/settings/privacy'),
            disabled: false,
        },
        {
            key: 2,
            icon: <Key size={20} />,
            title: 'Security',
            onclick: () => {},
            disabled: true,
        },
        {
            key: 3,
            icon: <PencilCircle size={20} />,
            title: 'Theme',
            onclick: () => {},
            disabled: true,
        },
        {
            key: 4,
            icon: <Image size={20} />,
            title: 'Chat Wallpaper',
            onclick: () => {},
            disabled: true,
        },
        {
            key: 5,
            icon: <Note size={20} />,
            title: 'Request Account Info',
            onclick: () => {},
            disabled: true,
        },
        {
            key: 6,
            icon: <Keyboard size={20} />,
            title: 'Keyboard Shortcuts',
            onclick: () => {},
            disabled: true,
        },
        {
            key: 7,
            icon: <Info size={20} />,
            title: 'Help',
            onclick: () => {},
            disabled: true,
        },
    ];

    return (
        <>
            <Stack direction={'row'} sx={{ width: '100%' }}>
                {/* LeftPanel */}
                <Box
                    sx={{
                        overflow: 'hidden',
                        height: '100vh',
                        width: 320,
                        backgroundColor: theme.palette.mode === 'light' ? '#f8faff' : theme.palette.background,
                        boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
                    }}
                >
                    <Stack p={4} spacing={5}>
                        {/* Header */}
                        <Stack direction={'row'} alignItems={'center'} spacing={3}>
                            <IconButton onClick={handleBackToApp}>
                                <CaretLeft size={24} color="#4b4b4b" />
                            </IconButton>
                            <Typography variant="h4">Settings</Typography>
                        </Stack>
                        {/* Profile */}
                        <Stack direction={'row'} spacing={3}>
                            <Avatar sx={{ width: '56', height: '56' }} src={user?.usr_avatar} alt={user?.usr_name} />
                            <Stack spacing={0.5}>
                                <Typography variant="article">{user?.usr_name}</Typography>
                                <Typography variant="body2">{user?.usr_bio}</Typography>
                            </Stack>
                        </Stack>
                        {/* List of options */}
                        <Stack
                            sx={{
                                maxHeight: 'calc(100vh - 240px)',
                                overflowY: 'auto',
                                paddingBottom: 1,
                                paddingTop: 1,
                            }}
                            spacing={4}
                        >
                            {list.map(({ key, icon, title, onclick, disabled }) => (
                                <Stack
                                    spacing={2}
                                    sx={{
                                        cursor: disabled ? 'default' : 'pointer', // Thay đổi kiểu con trỏ chuột
                                        opacity: disabled ? 0.5 : 1,
                                    }}
                                    onClick={disabled ? () => {} : onclick}
                                >
                                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                        {icon}
                                        <Typography variant="body2">{title}</Typography>
                                    </Stack>
                                    {key !== 7 && <Divider />}
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>
                </Box>
                {/* RightPanel */}
            </Stack>
        </>
    );
};

export default Settings;
