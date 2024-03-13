import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Stack, Switch } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import Logo from '../../assets/Images/logo1.png';
import { Nav_Buttons } from '../../data';
import { Gear } from 'phosphor-react';
import useSettings from '../../hooks/useSettings';
import ProfileMenu from './ProfileMenu';
import { socket, connectSocket } from '../../socket';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../redux/store';
import { useDispatch } from 'react-redux';
import {
    SelectConversation,
    UpdateFriendsRequestAction,
    showSnackbar,
    toggleSidebar,
    UpdateFriendsAction,
} from '../../redux/app/appActionCreators';
import {
    AddDirectConversation,
    AddDirectMessage,
    AddMessageReaction,
    UpdateBlockedConversation,
    UpdateConversationStatus,
    UpdateDirectConversation,
    RemoveDirectConversation,
    SetCurrentConversation,
} from '../../redux/conversation/convActionCreators';
import VideoCallNotification from '../../sections/dashboard/video/CallNotification';
import VideoCallDialog from '../../sections/dashboard/video/CallDialog';
import { PushToVideoCallQueue, UpdateVideoCallDialog } from '../../redux/videoCall/videoCallActionCreators';
import AntSwitch from '../../components/AntSwitch';
import { revertAll } from '../../redux/globalActions';

import useResponsive from '../../hooks/useResponsive';

const DashboardLayout = () => {
    // const isDesktop = useResponsive('up', 'md');

    //#region hooks
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { isLoggedIn, user_id, token } = useSelector((state) => state.auth);
    const { conversations, current_conversation } = useSelector((state) => state.conversation);
    const { open_video_notification_dialog, open_video_dialog } = useSelector((state) => state.videoCall);
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
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            if (!socket) {
                connectSocket(user_id, token);
            }

            // socket.on('audio_call_notification', (data) => {
            //     // TODO => dispatch an action to add this in call_queue
            //     dispatch(PushToAudioCallQueue(data));
            // });

            socket.on('video_call_notification', (data) => {
                // TODO => dispatch an action to add this in call_queue
                dispatch(PushToVideoCallQueue(data));
            });

            socket.on('new_message', (data) => {
                const message = data.message;
                // check if msg we got is from currently selected conversation

                if (current_conversation?.id === data.conversation._id) {
                    dispatch(AddDirectMessage(message));
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

            socket.on('get_reaction', (data) => {
                const message = data.message;
                if (current_conversation?.id === data.conversation_id) {
                    dispatch(AddMessageReaction({ message }));
                }
            });

            socket.on('start_chat', ({ chatroom, message }) => {
                // add / update to conversation list
                const existing_conversation = conversations.find((el) => el?.id === chatroom._id);
                if (existing_conversation) {
                    dispatch(UpdateDirectConversation({ conversation: chatroom }));
                } else {
                    dispatch(AddDirectConversation({ conversation: chatroom }));
                }
                dispatch(SelectConversation({ room_id: chatroom._id }));
                message && dispatch(showSnackbar({ severity: 'info', message }));
            });

            socket.on('update_conversation_list', ({ chatroom, message }) => {
                // add / update to conversation list
                const existing_conversation = conversations.find((el) => el?.id === chatroom._id);
                if (existing_conversation) {
                    dispatch(UpdateDirectConversation({ conversation: chatroom }));
                } else {
                    dispatch(AddDirectConversation({ conversation: chatroom }));
                }

                message && dispatch(showSnackbar({ severity: 'info', message }));
            });

            socket.on('leave_group', ({ chatroom, message }) => {
                const existing_conversation = conversations.find((el) => el?.id === chatroom._id);
                if (existing_conversation !== -1) {
                    dispatch(RemoveDirectConversation({ id: chatroom._id }));
                    dispatch(SelectConversation({ room_id: null }));
                    // dispatch(toggleSidebar());
                    dispatch(showSnackbar({ severity: 'info', message }));
                } else {
                    dispatch(showSnackbar({ severity: 'error', message: 'Error: Conversation not found.' }));
                }
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
                data.message &&
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
                handleFriendStatus(data);
                dispatch(UpdateFriendsAction(data.friendList));
            });

            socket.on('friend-remove', (data) => {
                handleFriendStatus(data);
                dispatch(UpdateFriendsAction(data.friendList));
            });

            socket.on('request_sent', (data) => {
                dispatch(showSnackbar({ severity: 'success', message: data.message }));
            });

            socket.on('friend-online', handleFriendStatus);

            socket.on('error', (data) => {
                dispatch(showSnackbar({ severity: 'error', message: data.message }));
            });

            socket.on('connect_error', (err) => {
                dispatch(revertAll());
                dispatch(showSnackbar({ severity: 'error', message: err.message }));
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
            socket?.off('video_call_notification');
            socket?.off('error');
            socket?.off('friend-online');
            socket?.off('friend-remove');
            socket?.off('get_reaction');
            socket?.off('friend_blocked');
            socket?.off('leave_group');
            socket?.off('update_conversation_list');
            socket?.off('connect_error');
        };
    }, [isLoggedIn, socket, conversations, current_conversation, user_id]);
    //#endregion hooks

    if (!isLoggedIn) {
        return <Navigate to={'/auth/login'} />;
    }

    // methods
    const handleToSettings = () => {
        navigate('/settings');
    };

    const handleFriendStatus = (data) => {
        const friendId = data.userId;
        const conversationsToUpdate = conversations.map((conversation) => {
            const hasParticipant =
                conversation.participant_ids?.includes(user_id) && conversation.participant_ids?.includes(friendId);

            if (hasParticipant) {
                let newConvStatus;
                if (conversation.type === 'PRIVATE') {
                    newConvStatus = {
                        ...conversation,
                        online: data.status,
                    };
                } else {
                    newConvStatus = {
                        ...conversation,
                        participant_details: conversation.participant_details.map((participant) => {
                            if (participant.user_id === friendId) {
                                return {
                                    ...participant,
                                    online: data.status,
                                };
                            }
                            return participant;
                        }),
                    };
                }

                if (newConvStatus.id === current_conversation?.id) {
                    dispatch(SetCurrentConversation(newConvStatus));
                }

                return newConvStatus;
            }

            return conversation;
        });
        dispatch(UpdateConversationStatus(conversationsToUpdate));
    };

    const handleNavigation = (path, index) => {
        navigate(path);
    };

    // const handleCloseAudioDialog = () => {
    //     dispatch(UpdateAudioCallDialog({ state: false }));
    // };

    const handleCloseVideoDialog = () => {
        dispatch(UpdateVideoCallDialog({ state: false }));
    };

    return (
        <>
            <Stack direction={'row'}>
                {/* {isDesktop && ( */}
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
                                                location.pathname === el.path
                                                    ? '#fff'
                                                    : theme.palette.mode === 'light'
                                                    ? '#000'
                                                    : theme.palette.text.primary,
                                            backgroundColor:
                                                location.pathname === el.path
                                                    ? theme.palette.primary.main
                                                    : 'transparent',
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
                                {location.pathname === '/settings' ? (
                                    <Box
                                        sx={{
                                            backgroundColor: theme.palette.primary.main,
                                            borderRadius: 1.5,
                                        }}
                                    >
                                        <IconButton
                                            onClick={handleToSettings}
                                            sx={{ width: 'max-content', color: '#fff' }}
                                        >
                                            <Gear />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <IconButton
                                        onClick={() => {
                                            handleToSettings();
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
                {/* )} */}

                <Outlet />
            </Stack>
            {/* {open_audio_notification_dialog && <AudioCallNotification open={open_audio_notification_dialog} />} */}
            {/* {open_audio_dialog && <AudioCallDialog open={open_audio_dialog} handleClose={handleCloseAudioDialog} />} */}
            {open_video_notification_dialog && <VideoCallNotification open={open_video_notification_dialog} />}
            {open_video_dialog && <VideoCallDialog open={open_video_dialog} handleClose={handleCloseVideoDialog} />}
        </>
    );
};

export default DashboardLayout;
