import React, { useEffect, useState } from 'react';
import { Badge, Dialog, DialogContent, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    FetchFriendRequests,
    FetchFriends,
    FetchSentFriendRequests,
    FetchUsers,
} from '../../redux/app/appActionCreators';
import {
    FriendComponent,
    FriendRequestComponent,
    SentRequestComponent,
    UserComponent,
    GroupComponent,
} from '../../components/Friends';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import {
    HourglassMedium,
    MagnifyingGlass,
    ShareNetwork,
    UsersThree,
    ArrowSquareIn,
    ArrowSquareOut,
    ChalkboardTeacher,
    CirclesFour,
} from 'phosphor-react';
import useDebounce from '../../hooks/useDebounce';

const UsersList = ({ searchQuery }) => {
    const dispatch = useDispatch();
    const debouncedSearchTerm = useDebounce(searchQuery, 500);

    useEffect(() => {
        dispatch(FetchUsers(debouncedSearchTerm));
    }, [debouncedSearchTerm]);

    const { users } = useSelector((state) => state.app);

    return (
        <>
            {users.length > 0 ? (
                users.map((el, idx) => {
                    return <UserComponent key={el._id} {...el} userList={users} />;
                })
            ) : (
                <Typography textAlign={'center'} fontStyle={'italic'}>
                    No result found
                </Typography>
            )}
        </>
    );
};

const FriendsList = ({ searchQuery, handleCloseDialog }) => {
    const dispatch = useDispatch();
    const debouncedSearchTerm = useDebounce(searchQuery, 500);

    useEffect(() => {
        dispatch(FetchFriends(debouncedSearchTerm));
    }, [debouncedSearchTerm]);

    const { friends } = useSelector((state) => state.app);

    return (
        <>
            {friends.length > 0 ? (
                friends.map((el, idx) => {
                    return (
                        <FriendComponent
                            key={el._id}
                            {...el}
                            handleCloseDialog={handleCloseDialog}
                            friendList={friends}
                        />
                    );
                })
            ) : (
                <Typography textAlign={'center'} fontStyle={'italic'}>
                    No result found
                </Typography>
            )}
        </>
    );
};

const FriendRequestList = ({ searchQuery }) => {
    const dispatch = useDispatch();
    const debouncedSearchTerm = useDebounce(searchQuery, 500);

    useEffect(() => {
        dispatch(FetchFriendRequests(debouncedSearchTerm));
    }, [debouncedSearchTerm]);

    const { friendRequests } = useSelector((state) => state.app);

    return (
        <>
            {friendRequests.length > 0 ? (
                friendRequests.map((el, idx) => {
                    //el => {_id, sender: {_id, firstName, lastName, img, online}}
                    return <FriendRequestComponent key={el._id} {...el} friendsRequestList={friendRequests} />;
                })
            ) : (
                <Typography textAlign={'center'} fontStyle={'italic'}>
                    No result found
                </Typography>
            )}
        </>
    );
};

const GroupsList = ({ searchQuery, handleCloseDialog }) => {
    const dispatch = useDispatch();

    const { conversations } = useSelector((state) => state.conversation);

    const group_conversations = conversations?.filter((conversation) => {
        return conversation.type === 'GROUP' && conversation.name.includes(searchQuery);
    });

    return (
        <>
            <Typography sx={{ pl: 1 }} variant="body2" color="textSecondary">
                Total Groups Participated: {group_conversations.length}
            </Typography>
            {group_conversations.length > 0 ? (
                group_conversations.map((group) => (
                    <GroupComponent key={group._id} {...group} handleCloseDialog={handleCloseDialog} />
                ))
            ) : (
                <Typography textAlign={'center'} fontStyle={'italic'}>
                    No result found
                </Typography>
            )}
        </>
    );
};

const SentRequestList = ({ searchQuery }) => {
    const dispatch = useDispatch();
    const debouncedSearchTerm = useDebounce(searchQuery, 500);

    useEffect(() => {
        dispatch(FetchSentFriendRequests(debouncedSearchTerm));
    }, [debouncedSearchTerm]);

    const { sentRequests } = useSelector((state) => state.app);

    return (
        <>
            {sentRequests.length > 0 ? (
                sentRequests.map((el, idx) => {
                    //el => {_id, sender: {_id, firstName, lastName, img, online}}
                    return <SentRequestComponent key={el._id} {...el} friendsRequestList={sentRequests} />;
                })
            ) : (
                <Typography textAlign={'center'} fontStyle={'italic'}>
                    No result found
                </Typography>
            )}
        </>
    );
};

const Friends = ({ open, handleClose }) => {
    const [value, setValue] = useState(0);
    const [subValue, setSubValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const { friendRequests } = useSelector((state) => state.app);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeSubTab = (event, newValue) => {
        setSubValue(newValue);
    };

    return (
        <Dialog open={open} keepMounted onClose={handleClose}>
            {/* <DialogTitle>{"Friends"}</DialogTitle> */}
            <Stack pl={4} pr={4} sx={{ width: '100%' }}>
                <Tabs sx={{ pt: 2 }} value={value} onChange={handleChange} centered>
                    <Tab sx={{ px: 1 }} icon={<ShareNetwork size={18} />} label="Explore" />
                    <Tab sx={{ px: 1 }} icon={<UsersThree size={18} />} label="Friends" />
                    <Tab
                        sx={{ px: 1 }}
                        icon={
                            <Badge
                                color="error"
                                badgeContent={friendRequests.length}
                                invisible={friendRequests.length === 0}
                                variant="dot"
                                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            >
                                <HourglassMedium size={18} />
                            </Badge>
                        }
                        label="Requests"
                    />
                    <Tab sx={{ px: 1 }} icon={<CirclesFour size={18} />} label="Groups" />
                </Tabs>
                {/* Search */}
                <Search>
                    <SearchIconWrapper>
                        <MagnifyingGlass color="#709CE6" />
                    </SearchIconWrapper>
                    <StyledInputBase
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search"
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </Search>
                {value === 2 && (
                    <Tabs sx={{ px: 1 }} value={subValue} onChange={handleChangeSubTab} centered>
                        <Tab sx={{ px: 1 }} icon={<ArrowSquareIn size={18} />} label="Received Requests" />
                        <Tab sx={{ px: 1 }} icon={<ArrowSquareOut size={18} />} label="Sent Requests" />
                    </Tabs>
                )}
            </Stack>
            {/* Dialog Content */}
            <DialogContent sx={{ height: '600px', overflowY: 'auto' }}>
                <Stack sx={{ height: '100%' }}>
                    <Stack spacing={2.4}>
                        {(() => {
                            switch (value) {
                                case 0: // display all users in this list
                                    return <UsersList searchQuery={searchQuery} />;

                                case 1: // display friends in this list
                                    return <FriendsList searchQuery={searchQuery} handleCloseDialog={handleClose} />;

                                case 2: // display request in this list
                                    if (subValue === 0) {
                                        return <FriendRequestList searchQuery={searchQuery} />;
                                    } else {
                                        return <SentRequestList searchQuery={searchQuery} />;
                                    }

                                case 3: // display all user groups in this list
                                    return <GroupsList searchQuery={searchQuery} handleCloseDialog={handleClose} />;

                                default:
                                    break;
                            }
                        })()}
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default Friends;
