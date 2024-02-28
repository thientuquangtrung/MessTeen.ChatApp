import { Box, useTheme, Stack, Avatar, Typography, IconButton, Divider, AvatarGroup } from '@mui/material';
import { faker } from '@faker-js/faker';
import React from 'react';
import StyledBadge from '../settings/StyledBadge';
import { CaretDown, Divide, MagnifyingGlass, Phone, VideoCamera } from 'phosphor-react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatch } from '../../redux/store';
import { toggleSidebar } from '../../redux/app/appActionCreators';
import { StartVideoCall } from '../../redux/videoCall/videoCallActionCreators';

const user_id = window.localStorage.getItem('user_id');

const Header = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { current_conversation } = useSelector((state) => state.conversation);
    const img = current_conversation?.img || [];
    const isGroup = current_conversation?.type === 'GROUP';

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
                        <Typography variant="subtitle2">{current_conversation?.name}</Typography>
                        <Typography variant="caption">{current_conversation?.online ? 'Online' : 'Offline'}</Typography>
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems={'center'} spacing={3}>
                    <IconButton
                        onClick={() => {
                            dispatch(StartVideoCall(user_id, current_conversation.user_id));
                        }}
                    >
                        <VideoCamera />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            // dispatch(StartAudioCall(current_conversation.user_id));
                        }}
                    >
                        <Phone />
                    </IconButton>
                    <IconButton>
                        <MagnifyingGlass />
                    </IconButton>
                    <Divider orientation="vertical" flexItem />
                    <IconButton>
                        <CaretDown />
                    </IconButton>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Header;
