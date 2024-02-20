import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, Stack, Tab, Tabs } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FetchFriendRequests, FetchFriends, FetchUsers } from '../../redux/app/appActionCreators';
import { FriendComponent, FriendRequestComponent, UserComponent } from '../../components/Friends';
import { Search, SearchIconWrapper, StyledInputBase } from '../../Search';
import { MagnifyingGlass } from 'phosphor-react';
import useDebounce from '../../hooks/useDebounce';

const UsersList = ({ searchQuery }) => {
    const dispatch = useDispatch();
    const debouncedSearchTerm = useDebounce(searchQuery, 500);

    useEffect(() => {
        dispatch(FetchUsers(debouncedSearchTerm));
    }, [debouncedSearchTerm]);

    const { users } = useSelector((state) => state.app);
    // console.log(users);
    return (
        <>
            {users.map((el, idx) => {
                return <UserComponent key={el._id} {...el} userList={users} />;
            })}
        </>
    );
};

const FriendsList = ({ searchQuery }) => {
    const dispatch = useDispatch();
    const debouncedSearchTerm = useDebounce(searchQuery, 500);

    useEffect(() => {
        dispatch(FetchFriends(debouncedSearchTerm));
    }, [debouncedSearchTerm]);

    const { friends } = useSelector((state) => state.app);

    return (
        <>
            {friends.map((el, idx) => {
                return <FriendComponent key={el._id} {...el} />;
            })}
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
            {friendRequests.map((el, idx) => {
                //el => {_id, sender: {_id, firstName, lastName, img, online}}
                return <FriendRequestComponent key={el._id} {...el} />;
            })}
        </>
    );
};

const Friends = ({ open, handleClose }) => {
    const [value, setValue] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Dialog fullWidth maxWidth="xs" open={open} keepMounted onClose={handleClose} sx={{ p: 4 }}>
            {/* <DialogTitle>{"Friends"}</DialogTitle> */}
            <Stack p={2} sx={{ width: '100%' }}>
                <Tabs value={value} onChange={handleChange} centered>
                    <Tab label="Explore" />
                    <Tab label="Friends" />
                    <Tab label="Requests" />
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
            </Stack>
            {/* Dialog Content */}
            <DialogContent>
                <Stack sx={{ height: '100%' }}>
                    <Stack spacing={2.4}>
                        {(() => {
                            switch (value) {
                                case 0: // display all users in this list
                                    return <UsersList searchQuery={searchQuery} />;

                                case 1: // display friends in this list
                                    return <FriendsList searchQuery={searchQuery} />;

                                case 2: // display request in this list
                                    return <FriendRequestList searchQuery={searchQuery} />;

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
