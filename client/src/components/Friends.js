import React, { useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Box, Badge, Avatar, Button, Typography, Stack, IconButton, AvatarGroup } from '@mui/material';
import { Chat } from 'phosphor-react';
import { faker } from '@faker-js/faker';
import { socket } from '../socket';
import { dispatch } from '../redux/store';
import { SelectConversation, UpdateUsersAction } from '../redux/app/appActionCreators';
import { UpdateFriendsRequestAction } from '../redux/app/appActionCreators';

const user_id = window.localStorage.getItem('user_id');

const StyledChatBox = styled(Box)(({ theme }) => ({
    '&:hover': {
        cursor: 'pointer',
    },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const UserComponent = ({ usr_name, _id, usr_status, usr_avatar, usr_pending_friends, userList }) => {
    const theme = useTheme();
    const isRequested = usr_pending_friends.includes(user_id);

    return (
        <StyledChatBox
            sx={{
                width: '100%',
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack direction="row" alignItems={'center'} justifyContent="space-between">
                <Stack direction="row" alignItems={'center'} spacing={2}>
                    {/* {" "} */}
                    {usr_status === 'ONLINE' ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar alt={usr_name} src={usr_avatar} />
                        </StyledBadge>
                    ) : (
                        <Avatar alt={usr_name} src={usr_avatar} />
                    )}

                    <Stack spacing={0.3}>
                        <Typography
                            style={{
                                maxWidth: '150px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            variant="subtitle2"
                        >
                            {usr_name}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <Button
                        onClick={() => {
                            socket.emit('friend_request', { to: _id, from: user_id }, () => {
                                alert('request sent');
                            });

                            const newUsersList = userList.map((u) => {
                                if (u._id === _id) {
                                    const index = u.usr_pending_friends.indexOf(user_id);
                                    if (index > -1) {
                                        const newUserPendingList = [...u.usr_pending_friends];

                                        newUserPendingList.splice(index, 1);

                                        return {
                                            ...u,
                                            usr_pending_friends: newUserPendingList,
                                        };
                                    } else {
                                        return {
                                            ...u,
                                            usr_pending_friends: [...u.usr_pending_friends, user_id],
                                        };
                                    }
                                }

                                return u;
                            });
                            dispatch(UpdateUsersAction(newUsersList));
                        }}
                    >
                        {isRequested ? 'Requested' : 'Send Request'}
                    </Button>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

const FriendRequestComponent = ({ usr_name, _id, usr_status, usr_avatar, friendsRequestList }) => {
    const theme = useTheme();

    return (
        <StyledChatBox
            sx={{
                width: '100%',
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack direction="row" alignItems={'center'} justifyContent="space-between">
                <Stack direction="row" alignItems={'center'} spacing={2}>
                    {' '}
                    {usr_status === 'ONLINE' ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar alt={usr_name} src={usr_avatar} />
                        </StyledBadge>
                    ) : (
                        <Avatar alt={usr_name} src={usr_avatar} />
                    )}
                    <Stack spacing={0.3}>
                        <Typography
                            style={{
                                maxWidth: '150px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            variant="subtitle2"
                        >
                            {usr_name}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <Button
                        onClick={() => {
                            socket.emit(
                                'accept_request',
                                {
                                    user_id,
                                    friend_id: _id,
                                },
                                () => {
                                    alert('request sent');
                                },
                            );
                            const newFriendsList = friendsRequestList.filter((u) => u._id !== _id);
                            dispatch(UpdateFriendsRequestAction(newFriendsList));
                        }}
                    >
                        Accept Request
                    </Button>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

const FriendComponent = ({ usr_avatar, usr_name, usr_status, _id, handleCloseDialog }) => {
    const theme = useTheme();

    return (
        <StyledChatBox
            sx={{
                width: '100%',
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack direction="row" alignItems={'center'} justifyContent="space-between">
                <Stack direction="row" alignItems={'center'} spacing={2}>
                    {' '}
                    {usr_status === 'ONLINE' ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar alt={usr_name} src={usr_avatar} />
                        </StyledBadge>
                    ) : (
                        <Avatar alt={usr_name} src={usr_avatar} />
                    )}
                    <Stack spacing={0.3}>
                        <Typography
                            style={{
                                maxWidth: '150px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            variant="subtitle2"
                        >
                            {usr_name}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <IconButton
                        onClick={() => {
                            // start a new conversation
                            socket.emit('start_conversation', { to: _id, from: user_id });
                            handleCloseDialog();
                        }}
                    >
                        <Chat />
                    </IconButton>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

const GroupComponent = ({ id, handleCloseDialog, img, name }) => {
    const theme = useTheme();

    return (
        <StyledChatBox
            sx={{
                width: '100%',
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack direction="row" alignItems={'center'} justifyContent="space-between">
                <Stack direction="row" alignItems={'center'} spacing={2}>
                    <AvatarGroup
                        spacing={20}
                        max={3}
                        sx={{
                            '.MuiAvatarGroup-avatar': { width: 24, height: 24 },
                        }}
                    >
                        {img.map((src) => (
                            <Avatar src={src} />
                        ))}
                    </AvatarGroup>

                    <Stack spacing={0.3}>
                        <Typography
                            style={{
                                maxWidth: '150px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            variant="subtitle2"
                        >
                            {name}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <IconButton
                        onClick={() => {
                            dispatch(SelectConversation({ room_id: id }));
                            handleCloseDialog();
                        }}
                    >
                        <Chat />
                    </IconButton>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

export { UserComponent, FriendRequestComponent, FriendComponent, GroupComponent };
