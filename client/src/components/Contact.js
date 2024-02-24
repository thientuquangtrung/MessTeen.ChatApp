import { Avatar, Box, Button, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Bell, CaretRight, Phone, Prohibit, Star, Trash, VideoCamera, X } from 'phosphor-react';
import { faker } from '@faker-js/faker';
import AntSwitch from './AntSwitch';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../redux/app/appActionCreators';
const Contact = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    return (
        <Box sx={{ width: 320, height: '100vh' }}>
            <Stack sx={{ height: '100%' }}>
                <Box
                    sx={{
                        boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
                        width: '100%',
                        backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
                    }}
                >
                    <Stack
                        direction="row"
                        sx={{ height: '100%', p: 2 }}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        spacing={3}
                    >
                        <Typography>Contact Info</Typography>
                        <IconButton onClick={() => dispatch(toggleSidebar())}>
                            <X />
                        </IconButton>
                    </Stack>
                </Box>
                {/* Body */}
                <Stack
                    sx={{ height: '100%', position: 'relative', flexGrow: 1, overflowY: 'scroll' }}
                    p={3}
                    spacing={3}
                >
                    <Stack alignItems={'center'} direction="row" spacing={2}>
                        <Avatar
                            src={faker.image.avatar()}
                            alt={faker.name.firstName()}
                            sx={{ height: 64, width: 64 }}
                        />
                        <Stack spacing={0.5}>
                            <Typography variant="article" fontWeight={600}>
                                {faker.name.fullName()}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                {'+91 729 2829 2992'}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack direction={'row'} alignItems={'center'} justifyContent="space-evenly">
                        <Stack spacing={1} alignItems={'center'}>
                            <IconButton>
                                <Phone />
                            </IconButton>
                            <Typography variant="overline">Voice</Typography>
                        </Stack>
                        <Stack spacing={1} alignItems={'center'}>
                            <IconButton>
                                <VideoCamera />
                            </IconButton>
                            <Typography variant="overline">Video</Typography>
                        </Stack>
                    </Stack>
                    <Divider />
                    <Stack spacing={0.5}>
                        <Typography variant="article">About</Typography>
                        <Typography variant="body2">Hi there</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction={'row'} alignItems={'center'} justifyContent="space-between">
                        <Typography variant="subtitle2">Media, Link & Docs</Typography>
                        <Button endIcon={<CaretRight />}> 401</Button>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {[1, 2, 3].map((el) => (
                            <Box>
                                <img src={faker.image.food()} alt={faker.name.fullName()} />
                            </Box>
                        ))}
                    </Stack>
                    <Divider />
                    <Stack direction={'row'} alignItems="center" justifyContent="space-between">
                        <Stack direction={'row'} alignItems="center" spacing={2}>
                            <Star size={21} />
                            <Typography variant="subtitle2">Starred Messages</Typography>
                        </Stack>
                        <IconButton>
                            <CaretRight />
                        </IconButton>
                    </Stack>
                    <Divider />
                    <Stack direction={'row'} alignItems="center" justifyContent="space-between">
                        <Stack direction={'row'} alignItems="center" spacing={2}>
                            <Bell size={21} />
                            <Typography variant="subtitle2">Mute Notification</Typography>
                        </Stack>
                        <AntSwitch />
                    </Stack>
                    <Divider />
                    <Typography>1 group in common</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={faker.image.avatar()} alt={faker.name.fullName()} />
                        <Stack spacing={0.5}>
                            <Typography variant="subtitle2">Duck Nghia</Typography>
                            <Typography variant="caption">Banana</Typography>
                        </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Button fullWidth variant="outlined" startIcon={<Prohibit />}>
                            Block
                        </Button>
                        <Button fullWidth variant="outlined" startIcon={<Trash />}>
                            Delete
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Contact;
