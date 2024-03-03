import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Stack, Switch } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import Logo from '../../assets/Images/logo1.png';
import { Nav_Buttons } from '../../data';
import { Gear } from 'phosphor-react';
import useSettings from '../../hooks/useSettings';
import ProfileMenu from './ProfileMenu';
import { socket, connectSocket } from '../../socket';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { SelectConversation, UpdateFriendsRequestAction, showSnackbar } from '../../redux/app/appActionCreators';
import {
    AddDirectConversation,
    AddDirectMessage,
    UpdateBlockedConversation,
    UpdateConversationStatus,
    UpdateDirectConversation,
} from '../../redux/conversation/convActionCreators';
import AntSwitch from '../../components/AntSwitch';

const DashboardLayout = () => {
    //#region hooks
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { isLoggedIn, user_id } = useSelector((state) => state.auth);
    const { conversations, current_conversation } = useSelector((state) => state.conversation);
    const [selected, setSelected] = useState(0);
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

            socket.on('new_message', (data) => {
                const message = data.message;
                console.log(current_conversation, data);
                // check if msg we got is from currently selected conversation
                if (current_conversation?.id === data.conversation._id) {
                    dispatch(
                        AddDirectMessage({
                            id: message._id,
                            type: 'msg',
                            subtype: message.msg_type,
                            message: message.msg_content,
                            incoming: message.msg_sender_id !== user_id,
                            outgoing: message.msg_sender_id === user_id,
                        }),
                    );
                }
                const existing_conversation = conversations.find((el) => el?.id === data.conversation._id);
                if (existing_conversation) {
                    // update direct conversation
                    dispatch(UpdateDirectConversation({ conversation: data.conversation }));
                } else {
                    // add direct conversation
                    dispatch(AddDirectConversation({ conversation: data.conversation }));
                }
            });

            socket.on('start_chat', (data) => {
                console.log(data);
                // add / update to conversation list
                const existing_conversation = conversations.find((el) => el?.id === data._id);
                if (existing_conversation) {
                    // update direct conversation
                    dispatch(UpdateDirectConversation({ conversation: data }));
                } else {
                    // add direct conversation
                    dispatch(AddDirectConversation({ conversation: data }));
                }
                dispatch(SelectConversation({ room_id: data._id }));
            });

            socket.on('friend_blocked', (data) => {
                dispatch(
                    UpdateBlockedConversation({
                        id: data.id,
                        blocked: data.blocked,
                    }),
                );
            });

            socket.on('new_friend_request', (data) => {
                dispatch(
                    showSnackbar({
                        severity: 'success',
                        message: data.message,
                    }),
                );
                dispatch(UpdateFriendsRequestAction(data.friendRequests));
            });

            socket.on('request_accepted', (data) => {
                dispatch(
                    showSnackbar({
                        severity: 'success',
                        message: data.message,
                    }),
                );
            });

            socket.on('request_sent', (data) => {
                dispatch(showSnackbar({ severity: 'success', message: data.message }));
            });

            socket.on('friend-online', (data) => {
                const friendId = data.userId; // Assuming you receive friend's user ID from data
                const conversationsToUpdate = conversations.map((conversation) => {
                    const hasParticipant =
                        conversation.participant_ids?.includes(user_id) &&
                        conversation.participant_ids?.includes(friendId);
                    console.log(conversation);
                    if (hasParticipant) {
                        return {
                            ...conversation,
                            online: data.status,
                        };
                    }

                    return conversation;
                });
                dispatch(UpdateConversationStatus(conversationsToUpdate));
            });

            socket.on('error', (data) => {
                dispatch(showSnackbar({ severity: 'error', message: data.message }));
            });
        }

        // Remove event listener on component unmount
        return () => {
            socket?.off('new_friend_request');
            socket?.off('request_accepted');
            socket?.off('request_sent');
            socket?.off('start_chat');
            socket?.off('new_message');
            socket?.off('audio_call_notification');
            socket?.off('error');
            socket?.off('friend-online');
        };
    }, [isLoggedIn, socket, conversations, current_conversation, user_id]);
    //#endregion hooks

    // methods
    const handleToSettings = () => {
        navigate('/settings');
    };

    // console.log(theme);

    if (!isLoggedIn) {
        return <Navigate to={'/auth/login'} />;
    }

    const handleNavigation = (path, index) => {
        navigate(path);
        setSelected(index);
    };

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
                            {Nav_Buttons.map((el, index) => (
                                <IconButton
                                    onClick={() => handleNavigation(el.path, index)}
                                    sx={{
                                        width: 'max-content',
                                        color:
                                            index === selected
                                                ? '#fff'
                                                : theme.palette.mode === 'light'
                                                ? '#000'
                                                : theme.palette.text.primary,
                                        backgroundColor:
                                            index === selected ? theme.palette.primary.main : 'transparent',
                                        borderRadius: 1.5,
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.main, // Màu nền khi hover
                                            color: '#fff',
                                        },
                                    }}
                                    key={el.index}
                                >
                                    {el.icon}
                                </IconButton>
                            ))}

                            <Divider sx={{ width: '48px' }} />
                            {selected === 3 ? (
                                <Box
                                    sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        borderRadius: 1.5,
                                    }}
                                >
                                    <IconButton onClick={handleToSettings} sx={{ width: 'max-content', color: '#fff' }}>
                                        <Gear />
                                    </IconButton>
                                </Box>
                            ) : (
                                <IconButton
                                    onClick={() => {
                                        handleToSettings();
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
