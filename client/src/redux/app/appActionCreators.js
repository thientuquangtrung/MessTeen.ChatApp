import axios from '../../utils/axios';
// import S3 from "../../utils/s3";
import { v4 } from 'uuid';
// import S3 from "../../utils/s3";
// import { S3_BUCKET_NAME } from "../../config";
import { slice } from './appReducer';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../utils/firebase';

export const closeSnackBar = () => async (dispatch, getState) => {
    dispatch(slice.actions.closeSnackBar());
};

export const showSnackbar =
    ({ severity, message }) =>
    async (dispatch, getState) => {
        dispatch(
            slice.actions.openSnackBar({
                message,
                severity,
            }),
        );

        setTimeout(() => {
            dispatch(slice.actions.closeSnackBar());
        }, 4000);
    };

export const toggleSidebar = () => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.toggleSidebar());
    };
};
export const updatedSidebarType = (type) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updatedSidebarType({ type }));
    };
};
// export function ToggleSidebar() {
//     return async (dispatch, getState) => {
//         dispatch(slice.actions.toggleSideBar());
//     };
// }
// export function UpdateSidebarType(type) {
//     return async (dispatch, getState) => {
//         dispatch(slice.actions.updateSideBarType({ type }));
//     };
// }
// export function UpdateTab(tab) {
//     return async (dispatch, getState) => {
//         dispatch(slice.actions.updateTab(tab));
//     };
// }

export function FetchUsers(searchQuery = '') {
    return async (dispatch, getState) => {
        await axios
            .get(`/users/explore-users/${getState().auth.user_id}?search=${searchQuery}`)
            .then((response) => {
                console.log(response);
                dispatch(slice.actions.updateUsers({ users: response.data.metadata }));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

export function UpdateUsersAction(userList) {
    return (dispatch, getState) => {
        dispatch(slice.actions.updateUsers({ users: userList }));
    };
}
// export function FetchAllUsers() {
//     return async (dispatch, getState) => {
//         await axios
//             .get(
//                 "/user/get-all-verified-users",

//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${getState().auth.token}`,
//                     },
//                 },
//             )
//             .then((response) => {
//                 console.log(response);
//                 dispatch(slice.actions.updateAllUsers({ users: response.data.data }));
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     };
// }
export function FetchFriends(searchQuery = '') {
    return async (dispatch, getState) => {
        await axios
            .get(`/users/friends-list/${getState().auth.user_id}`, {
                params: { search: searchQuery },
            })
            .then((response) => {
                console.log(response);
                dispatch(slice.actions.updateFriends({ friends: response.data.metadata }));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

export function FetchFriendRequests(searchQuery = '') {
    return async (dispatch, getState) => {
        await axios
            .get(`/users/pending-friend-requests/${getState().auth.user_id}?search=${searchQuery}`)
            .then((response) => {
                console.log(response);
                dispatch(slice.actions.updateFriendRequests({ requests: response.data.metadata }));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

export function BlockedFriendAction(friendId) {
    return async (dispatch, getState) => {
        await axios
            .post('/users/block-friend', {
                usr_id_1: getState().auth.user_id,
                usr_id_2: friendId,
            })
            .then((response) => {
                console.log(response);
                dispatch(slice.actions.updateBlockedFriends({ listBlockedFriends: response.data.metadata }));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

export function UnblockedFriendAction(friendId) {
    return async (dispatch, getState) => {
        await axios
            .post('/users/unblock-friend', {
                usr_id_1: getState().auth.user_id,
                usr_id_2: friendId,
            })
            .then((response) => {
                console.log(response);
                dispatch(slice.actions.updateBlockedFriends({ listBlockedFriends: response.data.metadata }));
            })
            .catch((err) => {
                console.log(err);
            });
    };
}

export function UpdateFriendsRequestAction(requestList) {
    return (dispatch, getState) => {
        dispatch(slice.actions.updateFriendRequests({ requests: requestList }));
    };
}

export const SelectConversation = ({ room_id }) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.selectConversation({ room_id }));
    };
};

// export const FetchCallLogs = () => {
//     return async (dispatch, getState) => {
//         axios
//             .get("/user/get-call-logs", {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${getState().auth.token}`,
//                 },
//             })
//             .then((response) => {
//                 console.log(response);
//                 dispatch(slice.actions.fetchCallLogs({ call_logs: response.data.data }));
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     };
// };
// export const FetchUserProfile = () => {
//     return async (dispatch, getState) => {
//         axios
//             .get("/user/get-me", {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${getState().auth.token}`,
//                 },
//             })
//             .then((response) => {
//                 console.log(response);
//                 dispatch(slice.actions.fetchUser({ user: response.data.data }));
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     };
// };

export const UpdateUserProfile = (formValues) => {
    return async (dispatch, getState) => {
        const file = formValues.avatar;
        const key = v4();
        const storageRef = ref(storage, `avatars/${key}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Handle progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                // Handle unsuccessful uploads
                console.error('Error uploading file:', error);
            },
            async () => {
                // Handle successful uploads
                console.log('File uploaded successfully');

                // Get the download URL of the uploaded file
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                console.log('downloadURL::::::::::::', downloadURL);
                axios
                    .put(`/users/update-profile-user/${getState().auth.user_id}`, {
                        ...formValues,
                        avatar: downloadURL,
                    })
                    .then((response) => {
                        console.log(response);
                        dispatch(slice.actions.updateUser({ user: response.data.metadata }));
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
        );
    };
};

export const SetUser = (userData) => {
    return (dispatch, getState) => {
        dispatch(slice.actions.updateUser({ user: userData }));
    };
};
