import { Avatar, Badge, Box, Button, Divider, IconButton, InputBase, Stack, Typography, useTheme } from '@mui/material';
import { ArchiveBox, CircleDashed, MagnifyingGlass, Users } from 'phosphor-react';
import React, { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material';
import { faker } from '@faker-js/faker';
import { ChatList } from '../../data';
import Friends from '../../sections/main/Friends';
import { socket } from '../../socket';
import { useDispatch, useSelector } from 'react-redux';
import { SelectConversation } from '../../redux/app/appActionCreators';
import { FetchDirectConversations } from '../../redux/conversation/convActionCreators';
import { formatDate } from '../../utils/formatTime';

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

const ChatElement = ({ id, name, img, msg, time, unread, online }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { room_id } = useSelector((state) => state.app);
    const selectedChatId = room_id?.toString();

    let isSelected = selectedChatId === id;

    if (!selectedChatId) {
        isSelected = false;
    }

    return (
        <Box
            onClick={() => {
                dispatch(SelectConversation({ room_id: id }));
            }}
            sx={{
                width: '100%',
                borderRadius: 1,
                backgroundColor: isSelected
                    ? theme.palette.mode === 'light'
                        ? alpha(theme.palette.primary.main, 0.2)
                        : theme.palette.primary.main
                    : theme.palette.mode === 'light'
                    ? '#fff'
                    : theme.palette.background.paper,
            }}
            p={2}
        >
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Stack direction={'row'} spacing={2}>
                    {online ? (
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar src={faker.image.avatar()} />
                        </StyledBadge>
                    ) : (
                        <Avatar src={faker.image.avatar()} />
                    )}

                    <Stack spacing={0.3}>
                        <Typography variant="subtitle2">{name}</Typography>
                        <Typography
                            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '140px' }}
                            variant="caption"
                        >
                            {msg}
                        </Typography>
                    </Stack>
                </Stack>
                <Stack spacing={2} alignItems={'center'}>
                    <Typography sx={{ fontWeight: '600' }} variant="caption">
                        {formatDate(time)}
                    </Typography>
                    <Badge color="primary" badgeContent={unread}></Badge>
                </Stack>
            </Stack>
        </Box>
    );
};

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: 20,
    backgroundColor: alpha(theme.palette.background.paper, 1),
    marginLeft: 0,
    width: '100%',
    marginRight: theme.spacing(2),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    },
}));

const user_id = window.localStorage.getItem('user_id');

const Chats = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const theme = useTheme();

    const dispatch = useDispatch();
    const { conversations } = useSelector((state) => state.conversation);
    const { friendRequests } = useSelector((state) => state.app);

    useEffect(() => {
        socket.emit('get_direct_conversations', { user_id }, (data) => {
            console.log(data); // this data is the list of conversations
            // dispatch action

            dispatch(FetchDirectConversations({ conversations: data }));
        });
    }, []);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    width: 320,
                    backgroundColor: theme.palette.mode === 'light' ? 'F8FAFF' : theme.palette.background.paper,
                    boxShadow: '0px 0px 2px rgba(0,0,0,0.25)',
                }}
            >
                <Stack p={3} spacing={2} sx={{ height: '100vh' }}>
                    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                        <Typography variant="h5">Chats</Typography>

                        <Stack direction="row" alignItems="center" spacing={1}>
                            <IconButton
                                onClick={() => {
                                    handleOpenDialog();
                                }}
                            >
                                <Badge
                                    color="error"
                                    badgeContent={friendRequests.length}
                                    invisible={friendRequests.length === 0}
                                >
                                    <Users />
                                </Badge>
                            </IconButton>
                            <IconButton>
                                <CircleDashed />
                            </IconButton>
                        </Stack>
                    </Stack>
                    <Stack sx={{ width: '100%' }}>
                        <Search>
                            <SearchIconWrapper>
                                <MagnifyingGlass color="#709CE6" />
                            </SearchIconWrapper>
                            <StyledInputBase placeholder="Search..." inputProps={{ 'aria-label': 'search' }} />
                        </Search>
                    </Stack>
                    <Stack spacing={1}>
                        <Stack direction={'row'} alignItems={'center'} spacing={1.5}>
                            <ArchiveBox size={24} />
                            <Button>Archive</Button>
                        </Stack>
                        <Divider />
                    </Stack>
                    <Stack
                        spacing={2}
                        direction={'column'}
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            height: '100%',
                            // '&::-webkit-scrollbar': {
                            //     background: theme.palette.mode === 'light' ? 'F8FAFF' : theme.palette.background.paper,
                            // },
                            // '&::-webkit-scrollbar-thumb': {
                            //     backgroundColor: theme.palette.mode === 'light' ? '#44b700' : '#709CE6', // Adjust colors based on your design
                            // },
                        }}
                    >
                        {/* <SimpleBarStyle/> */}
                        <Stack spacing={2.4}>
                            <Typography variant="subtitle2" sx={{ color: '#676767' }}>
                                Pinned
                            </Typography>
                            {ChatList.filter((el) => el.pinned).map((el) => {
                                return <ChatElement {...el} />;
                            })}
                        </Stack>
                        <Stack spacing={2.4}>
                            <Typography variant="subtitle2" sx={{ color: '#676767' }}>
                                All Chats
                            </Typography>
                            {conversations
                                .filter((el) => !el.pinned)
                                .map((el) => {
                                    return <ChatElement {...el} />;
                                })}
                        </Stack>
                    </Stack>
                </Stack>
            </Box>

            {openDialog && <Friends open={openDialog} handleClose={handleCloseDialog} />}
        </>
    );
};

export default Chats;
