import { Box, useTheme, Stack, Avatar, Typography, IconButton, Divider, AvatarGroup } from '@mui/material';
import { faker } from '@faker-js/faker';
import React from 'react';
import StyledBadge from '../settings/StyledBadge';
import {
    CaretDown,
    CaretLeft,
    CaretRight,
    Divide,
    MagnifyingGlass,
    Phone,
    UsersThree,
    VideoCamera,
} from 'phosphor-react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatch } from '../../redux/store';
import { showSnackbar, toggleSidebar } from '../../redux/app/appActionCreators';
import { StartVideoCall } from '../../redux/videoCall/videoCallActionCreators';
import useResponsive from '../../hooks/useResponsive';

const user_id = window.localStorage.getItem('user_id');

const Header = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const isMobile = useResponsive('between', 'md', 'xs', 'sm');
    const isDesktop = useResponsive('up', 'md');

    const { current_conversation } = useSelector((state) => state.conversation);
    const { friends, sidebar, blockedFriends } = useSelector((state) => state.app);
    const isBlocked = blockedFriends.includes(current_conversation?.user_id);
    const img = current_conversation?.img || [];
    const isGroup = current_conversation?.type === 'GROUP';
    const isFriend = friends?.some((f) => f._id === current_conversation?.user_id);

    return (
        <Box
            p={2}
            sx={{
                height: 100,
                width: '100%',
                backgroundColor: theme.palette.mode === 'light' ? 'F8FAFF' : theme.palette.background.paper,
                boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
            }}
        >
            <Stack
                alignItems={'center'}
                direction={'row'}
                justifyContent={'space-between'}
                sx={{ width: '100%', height: '100%' }}
            >
                <Stack
                    onClick={() => {
                        dispatch(toggleSidebar());
                    }}
                    direction={'row'}
                    spacing={2}
                    sx={{ cursor: 'pointer' }}
                >
                    <Box>
                        {current_conversation?.online ? (
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                {/* <Avatar alt={current_conversation?.name} src={current_conversation?.img} /> */}
                                <AvatarGroup
                                    spacing={20}
                                    max={3}
                                    sx={{
                                        '.MuiAvatarGroup-avatar': isGroup
                                            ? { width: 24, height: 24 }
                                            : { width: 40, height: 40 },
                                    }}
                                >
                                    {img.map((src) => (
                                        <Avatar src={src} />
                                    ))}
                                </AvatarGroup>
                            </StyledBadge>
                        ) : (
                            // <Avatar alt={current_conversation?.name} src={current_conversation?.img} />
                            <AvatarGroup
                                spacing={20}
                                max={3}
                                sx={{
                                    '.MuiAvatarGroup-avatar': isGroup
                                        ? { width: 24, height: 24 }
                                        : { width: 40, height: 40 },
                                }}
                            >
                                {img.map((src) => (
                                    <Avatar src={src} />
                                ))}
                            </AvatarGroup>
                        )}
                    </Box>
                    <Stack spacing={0.2}>
                        <Stack direction={'row'} spacing={0.8} sx={{ display: 'flex', alignItems: 'center' }}>
                            {isGroup ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#f2f2ff',
                                        borderRadius: '30%',
                                        padding: '3px',
                                    }}
                                >
                                    <UsersThree
                                        weight="regular"
                                        style={{
                                            color: '#2d63c6',
                                        }}
                                    />
                                </Box>
                            ) : null}
                            {isDesktop && <Typography variant="subtitle2">{current_conversation?.name}</Typography>}
                        </Stack>
                        <Typography variant="caption">
                            {!isFriend && !isGroup ? 'Stranger' : current_conversation?.online ? 'Online' : 'Offline'}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems={'center'} spacing={isMobile ? 1 : 3}>
                    {current_conversation?.type === 'PRIVATE' && isFriend && (
                        <IconButton
                            onClick={() => {
                                if (!isBlocked && !current_conversation?.isBeingBlocked) {
                                    dispatch(StartVideoCall(user_id, current_conversation.user_id));
                                } else {
                                    dispatch(
                                        showSnackbar({
                                            severity: 'info',
                                            message: ' You cannot text or call in this chat.',
                                        }),
                                    );
                                }
                            }}
                        >
                            <VideoCamera />
                        </IconButton>
                    )}
                    {/* <IconButton
                        onClick={() => {
                            // dispatch(StartAudioCall(current_conversation.user_id));
                        }}
                    >
                        <Phone />
                    </IconButton> */}
                    {isDesktop && (
                        <IconButton>
                            <MagnifyingGlass />
                        </IconButton>
                    )}
                    <Divider orientation="vertical" flexItem />
                    <IconButton
                        onClick={() => {
                            dispatch(toggleSidebar());
                        }}
                    >
                        {sidebar.open ? <CaretRight /> : <CaretLeft />}
                    </IconButton>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Header;
