import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Stack, Switch } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import Logo from '../../assets/Images/logo1.png';
import { Nav_Buttons } from '../../data';
import { Gear } from 'phosphor-react';
import useSettings from '../../hooks/useSettings';
import ProfileMenu from './ProfileMenu';
import { socket, connectSocket } from '../../socket';
import { useSelector } from '../../redux/store';

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 40,
    height: 20,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 16,
        height: 16,
        borderRadius: 8,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 20 / 2,
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));
const DashboardLayout = () => {
    const theme = useTheme();
    const { isLoggedIn, user_id } = useSelector((state) => state.auth);

    const [selected, setSelected] = useState(0);

    console.log(theme);

    const { onToggleMode } = useSettings();

    useEffect(() => {
        if (isLoggedIn) {
            window.onload = function () {
                if (!window.location.hash) {
                    window.location = window.location + '#loaded';
                    window.location.reload();
                }
            };

            window.onload();

            if (!socket) {
                connectSocket(user_id);
            }

            // socket.on('audio_call_notification', (data) => {
            //     // TODO => dispatch an action to add this in call_queue
            //     dispatch(PushToAudioCallQueue(data));
            // });

            // socket.on('video_call_notification', (data) => {
            //     // TODO => dispatch an action to add this in call_queue
            //     dispatch(PushToVideoCallQueue(data));
            // });

            // socket.on('new_message', (data) => {
            //     const message = data.message;
            //     console.log(current_conversation, data);
            //     // check if msg we got is from currently selected conversation
            //     if (current_conversation?.id === data.conversation_id) {
            //         dispatch(
            //             AddDirectMessage({
            //                 id: message._id,
            //                 type: 'msg',
            //                 subtype: message.type,
            //                 message: message.text,
            //                 incoming: message.to === user_id,
            //                 outgoing: message.from === user_id,
            //             }),
            //         );
            //     }
            // });

            // socket.on('start_chat', (data) => {
            //     console.log(data);
            //     // add / update to conversation list
            //     const existing_conversation = conversations.find((el) => el?.id === data._id);
            //     if (existing_conversation) {
            //         // update direct conversation
            //         dispatch(UpdateDirectConversation({ conversation: data }));
            //     } else {
            //         // add direct conversation
            //         dispatch(AddDirectConversation({ conversation: data }));
            //     }
            //     dispatch(SelectConversation({ room_id: data._id }));
            // });

            // socket.on('new_friend_request', (data) => {
            //     dispatch(
            //         showSnackbar({
            //             severity: 'success',
            //             message: 'New friend request received',
            //         }),
            //     );
            // });

            // socket.on('request_accepted', (data) => {
            //     dispatch(
            //         showSnackbar({
            //             severity: 'success',
            //             message: 'Friend Request Accepted',
            //         }),
            //     );
            // });

            // socket.on('request_sent', (data) => {
            //     dispatch(showSnackbar({ severity: 'success', message: data.message }));
            // });
        }

        // Remove event listener on component unmount
        return () => {
            socket?.off('new_friend_request');
            socket?.off('request_accepted');
            socket?.off('request_sent');
            socket?.off('start_chat');
            socket?.off('new_message');
            socket?.off('audio_call_notification');
        };
    }, [socket]);
    //   }, [isLoggedIn, socket]);

    // TODO: uncomment when done some important features
    // if (!isLoggedIn) {
    //     return <Navigate to={"/auth/login"} />;
    // }

    return (
        <Stack direction={'row'}>
            <Box
                p={2}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
                    height: '100vh',
                    width: 100,
                }}
            >
                <Stack
                    direction="column"
                    alignItems={'center'}
                    sx={{ height: '100%' }}
                    spacing={3}
                    justifyContent={'space-between'}
                >
                    <Stack alignItems={'center'} spacing={4}>
                        <Box
                            sx={{
                                // backgroundColor: theme.palette.primary.main,
                                height: 64,
                                width: 64,
                                borderRadius: 1.5,
                            }}
                        >
                            <img src={Logo} alt="Chat App Logo" />
                        </Box>
                        <Stack sx={{ width: 'max-content' }} direction={'column'} alignItems={'center'} spacing={3}>
                            {Nav_Buttons.map((el) =>
                                el.index === selected ? (
                                    <Box
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            borderRadius: 1.5,
                                        }}
                                    >
                                        <IconButton sx={{ width: 'max-content', color: '#fff' }} key={el.index}>
                                            {el.icon}
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <IconButton
                                        onClick={() => {
                                            setSelected(el.index);
                                        }}
                                        sx={{
                                            width: 'max-content',
                                            color: theme.palette.mode === 'light' ? '#000' : theme.palette.text.primary,
                                        }}
                                        key={el.index}
                                    >
                                        {el.icon}
                                    </IconButton>
                                ),
                            )}
                            <Divider sx={{ width: '48px' }} />
                            {selected === 3 ? (
                                <Box
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        borderRadius: 1.5,
                                    }}
                                >
                                    <IconButton sx={{ width: 'max-content', color: '#fff' }}>
                                        <Gear />
                                    </IconButton>
                                </Box>
                            ) : (
                                <IconButton
                                    onClick={() => {
                                        setSelected(3);
                                    }}
                                    sx={{
                                        width: 'max-content',
                                        color: theme.palette.mode === 'light' ? '#000' : theme.palette.text.primary,
                                    }}
                                >
                                    <Gear />
                                </IconButton>
                            )}
                        </Stack>
                    </Stack>

                    <Stack spacing={4}>
                        {/* Switch */}
                        <AntSwitch
                            onChange={() => {
                                onToggleMode();
                            }}
                            defaultChecked
                        />
                        {/* <Avatar src={faker.image.avatar()} /> */}
                        <ProfileMenu />
                    </Stack>
                </Stack>
            </Box>
            <Outlet />
        </Stack>
    );
};

export default DashboardLayout;
