import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Stack, Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
    FetchFriendRequests,
    FetchFriends,
    FetchUsers,
} from "../../redux/app/appActionCreators";
import {
    FriendComponent,
    FriendRequestComponent,
    UserComponent,
} from "../../components/Friends";

const UsersList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(FetchUsers());
    }, []);

    const { users } = useSelector((state) => state.app);

    return (
        <>
            {/* {users.map((el, idx) => {
                //TODO => Render UserComponent
                return <UserComponent key={el._id} {...el} />;
            })} */}
            <UserComponent />
        </>
    );
};

const FriendsList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(FetchFriends());
    }, []);

    const { friends } = useSelector((state) => state.app);

    return (
        <>
            {friends.map((el, idx) => {
                //TODO => Render FriendComponent
                //TODO => Render FriendComponent
                return <FriendComponent key={el._id} {...el} />;
            })}
        </>
    );
};

const FriendRequestList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(FetchFriendRequests());
    }, []);

    const { friendRequests } = useSelector((state) => state.app);

    return (
        <>
            {friendRequests.map((el, idx) => {
                //el => {_id, sender: {_id, firstName, lastName, img, online}}
                //TODO => Render FriendRequestComponent
                return (
                    <FriendRequestComponent
                        key={el._id}
                        {...el.sender}
                        id={el._id}
                    />
                );
            })}
        </>
    );
};

const Friends = ({ open, handleClose }) => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={open}
            keepMounted
            onClose={handleClose}
            sx={{ p: 4 }}
        >
            {/* <DialogTitle>{"Friends"}</DialogTitle> */}
            <Stack p={2} sx={{ width: "100%" }}>
                <Tabs value={value} onChange={handleChange} centered>
                    <Tab label="Explore" />
                    <Tab label="Friends" />
                    <Tab label="Requests" />
                </Tabs>
            </Stack>
            {/* Dialog Content */}
            <DialogContent>
                <Stack sx={{ height: "100%" }}>
                    <Stack spacing={2.4}>
                        {(() => {
                            switch (value) {
                                case 0: // display all users in this list
                                    return <UsersList />;

                                case 1: // display friends in this list
                                    return <FriendsList />;

                                case 2: // display request in this list
                                    return <FriendRequestList />;

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
