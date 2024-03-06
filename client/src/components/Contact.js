import {
    Avatar,
    Box,
    Button,
    Collapse,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import {
    Bell,
    CaretDown,
    CaretRight,
    Phone,
    Prohibit,
    SignOut,
    Star,
    Trash,
    UserCirclePlus,
    VideoCamera,
    X,
} from 'phosphor-react';
import { faker } from '@faker-js/faker';
import AntSwitch from './AntSwitch';
import { useDispatch, useSelector } from 'react-redux';
import AddFriendToGroup from '../sections/main/AddFriendsToGroup';
import LeaveGroup from '../sections/main/LeaveGroup';
import { BlockedFriendAction, UnblockedFriendAction, toggleSidebar } from '../redux/app/appActionCreators';

const user_id = window.localStorage.getItem('user_id');

const Contact = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { current_conversation } = useSelector((state) => state.conversation);
    const isGroup = current_conversation?.type === 'GROUP';
    const { blockedFriends } = useSelector((state) => state.app);
    const isBlocked = blockedFriends.includes(current_conversation?.user_id);

    const img = current_conversation?.img || [];

    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogGroup, setOpenDialogGroup] = useState(false);
    const [openDialogLeaveGroup, setOpenDialogLeaveGroup] = useState(false);

    const handleCloseDialogGroup = () => {
        setOpenDialogGroup(false);
    };

    const handleCloseDialogLeaveGroup = () => {
        setOpenDialogLeaveGroup(false);
    };

    const handleFriendAction = () => {
        if (isBlocked) {
            dispatch(UnblockedFriendAction(current_conversation?.user_id));
        } else {
            dispatch(BlockedFriendAction(current_conversation?.user_id));
        }
    };

    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

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
                        {!isGroup ? <Typography>Contact Info</Typography> : <Typography>Group Info</Typography>}

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
                            src={current_conversation?.img}
                            alt={current_conversation?.name}
                            sx={{ height: 64, width: 64 }}
                        />
                        <Stack spacing={0.5}>
                            <Typography variant="article" fontWeight={600}>
                                {current_conversation?.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                style={{
                                    maxWidth: '180px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {current_conversation?.email}
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

                    {isGroup ? (
                        <Stack>
                            <ListItemButton
                                onClick={handleClick}
                                sx={{
                                    paddingLeft: 0,
                                    paddingRight: 1,
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                <Stack
                                    direction="row"
                                    sx={{ width: '100%' }}
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="subtitle2">
                                        Group Members: {current_conversation.participant_details?.length}
                                    </Typography>
                                    {open ? (
                                        <CaretDown style={{ width: 24, height: 24, color: '#637381' }} />
                                    ) : (
                                        <CaretRight style={{ width: 24, height: 24, color: '#637381' }} />
                                    )}
                                </Stack>
                            </ListItemButton>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {current_conversation.participant_details?.map((participant) => (
                                        <ListItemButton key={participant._id}>
                                            <ListItemIcon>
                                                <Avatar
                                                    sx={{ width: 24, height: 24 }}
                                                    src={participant.img}
                                                    alt={participant.name}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                sx={{
                                                    '.MuiListItemText-primary': {
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    },
                                                }}
                                                primary={participant.name}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </Stack>
                    ) : (
                        <>
                            <Typography variant="article">About</Typography>
                            {current_conversation?.about ? (
                                <Typography variant="body2">{current_conversation?.about}</Typography>
                            ) : (
                                <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic' }}>
                                    User has not provided information in the About section.
                                </Typography>
                            )}
                        </>
                    )}

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
                    {/* Private */}
                    {!isGroup ? (
                        <>
                            <Typography>1 group in common</Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar src={faker.image.avatar()} alt={faker.name.fullName()} />
                                <Stack spacing={0.5}>
                                    <Typography variant="subtitle2">Duck Nghia</Typography>
                                    <Typography variant="caption">Banana</Typography>
                                </Stack>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<Prohibit />}
                                    onClick={handleFriendAction}
                                >
                                    {isBlocked ? 'Unblock' : 'Block'}
                                </Button>
                                <Button fullWidth variant="outlined" startIcon={<Trash />}>
                                    Delete
                                </Button>
                            </Stack>
                        </>
                    ) : (
                        <>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Button
                                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<UserCirclePlus />}
                                    onClick={() => {
                                        setOpenDialogGroup(true);
                                    }}
                                >
                                    Add Friend
                                </Button>
                                {openDialogGroup && (
                                    <AddFriendToGroup open={openDialogGroup} handleClose={handleCloseDialogGroup} />
                                )}
                                <Button
                                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<SignOut />}
                                    onClick={() => {
                                        setOpenDialogLeaveGroup(true);
                                    }}
                                >
                                    Leave Group
                                </Button>
                                {openDialogLeaveGroup && (
                                    <LeaveGroup open={openDialogLeaveGroup} handleClose={handleCloseDialogLeaveGroup} />
                                )}
                            </Stack>
                        </>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
};

export default Contact;
