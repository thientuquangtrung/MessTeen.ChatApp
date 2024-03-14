import React, { useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Box, Badge, Avatar, Button, Typography, Stack, IconButton, AvatarGroup } from '@mui/material';
import { Chat, UserMinus } from 'phosphor-react';
import { faker } from '@faker-js/faker';
import { socket } from '../socket';
import { dispatch } from '../redux/store';
import {
    UpdateFriendsAction,
    UpdateSentFriendsRequestAction,
    UpdateUsersAction,
    showSnackbar,
    SelectConversation,
    UpdateFriendsRequestAction,
} from '../redux/app/appActionCreators';

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

const UserComponent = ({ usr_name, _id, usr_email, usr_avatar, userList }) => {
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
                    <Avatar alt={usr_name} src={usr_avatar} />

                    <Stack spacing={0.3}>
                        <Typography
                            style={{
                                maxWidth: '200px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            variant="subtitle2"
                        >
                            {usr_name}
                        </Typography>
                        <Typography
                            style={{
                                maxWidth: '200px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontStyle: 'italic',
                            }}
                            variant="body2"
                            color="textSecondary"
                        >
                            {usr_email}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <Button
                        onClick={() => {
                            socket.emit('friend_request', { to: _id, from: user_id }, () => {
                                alert('request sent');
                            });

                            const newExploresList = userList.filter((u) => u._id !== _id);
                            dispatch(UpdateUsersAction(newExploresList));
                        }}
                    >
                        Send Request
                    </Button>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

const FriendRequestComponent = ({ usr_name, _id, usr_email, usr_avatar, friendsRequestList }) => {
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
                    <Avatar alt={usr_name} src={usr_avatar} />
                    <Stack spacing={0.3}>
                        <Typography
                            style={{
                                maxWidth: '200px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            variant="subtitle2"
                        >
                            {usr_name}
                        </Typography>
                        <Typography
                            style={{
                                maxWidth: '200px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontStyle: 'italic',
                            }}
                            variant="body2"
                            color="textSecondary"
                        >
                            {usr_email}
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

const SentRequestComponent = ({ usr_name, _id, usr_email, usr_avatar, friendsRequestList }) => {
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
                    <Avatar alt={usr_name} src={usr_avatar} />
                    <Stack spacing={0.3}>
                        <Typography
                            style={{
                                maxWidth: '200px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            variant="subtitle2"
                        >
                            {usr_name}
                        </Typography>
                        <Typography
                            style={{
                                maxWidth: '200px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontStyle: 'italic',
                            }}
                            variant="body2"
                            color="textSecondary"
                        >
                            {usr_email}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                    <Button
                        onClick={() => {
                            socket.emit('friend_request', { to: _id, from: user_id }, () => {
                                alert('request sent');
                            });
                            const newSentFriendsRequest = friendsRequestList.filter((u) => u._id !== _id);
                            dispatch(UpdateSentFriendsRequestAction(newSentFriendsRequest));
                        }}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </StyledChatBox>
    );
};

const FriendComponent = ({ usr_avatar, usr_name, usr_email, usr_status, _id, handleCloseDialog, friendList }) => {
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
                    {usr_status !== 'OFFLINE' ? (
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
                                maxWidth: '200px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            variant="subtitle2"
                        >
                            {usr_name}
                        </Typography>
                        <Typography
                            style={{
                                maxWidth: '200px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontStyle: 'italic',
                            }}
                            variant="body2"
                            color="textSecondary"
                        >
                            {usr_email}
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
                    <IconButton
                        onClick={() => {
                            // unfriend
                            socket.emit(
                                'unfriend',
                                {
                                    user_id,
                                    friend_id: _id,
                                },
                                ({ message }) => {
                                    dispatch(showSnackbar({ severity: 'success', message }));
                                    const newFriendsList = friendList.filter((u) => u._id !== _id);
                                    dispatch(UpdateFriendsAction(newFriendsList));
                                },
                            );
                        }}
                    >
                        <UserMinus />
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
                                maxWidth: '200px',
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

export { UserComponent, FriendRequestComponent, SentRequestComponent, FriendComponent, GroupComponent };
