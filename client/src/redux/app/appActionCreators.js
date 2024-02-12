import axios from '../../utils/axios';
// import S3 from "../../utils/s3";
// import { v4 } from "uuid";
// import S3 from "../../utils/s3";
// import { S3_BUCKET_NAME } from "../../config";
import { slice } from './appReducer';
// ----------------------------------------------------------------------

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
            .get(`/users/friends-list/${getState().auth.user_id}?search=${searchQuery}`)
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

// export const SelectConversation = ({ room_id }) => {
//     return async (dispatch, getState) => {
//         dispatch(slice.actions.selectConversation({ room_id }));
//     };
// };

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
// export const UpdateUserProfile = (formValues) => {
//     return async (dispatch, getState) => {
//         const file = formValues.avatar;

//         const key = v4();

//         try {
//             S3.getSignedUrl("putObject", { Bucket: S3_BUCKET_NAME, Key: key, ContentType: `image/${file.type}` }, async (_err, presignedURL) => {
//                 await fetch(presignedURL, {
//                     method: "PUT",

//                     body: file,

//                     headers: {
//                         "Content-Type": file.type,
//                     },
//                 });
//             });
//         } catch (error) {
//             console.log(error);
//         }

//         axios
//             .patch(
//                 "/user/update-me",
//                 { ...formValues, avatar: key },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${getState().auth.token}`,
//                     },
//                 },
//             )
//             .then((response) => {
//                 console.log(response);
//                 dispatch(slice.actions.updateUser({ user: response.data.data }));
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     };
// };
