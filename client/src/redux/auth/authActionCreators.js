import axios from '../../utils/axios';
import { slice } from './authReducer';
import { showSnackbar } from '../app/appActionCreators';

// export function NewPassword(formValues) {
//     return async (dispatch, getState) => {
//         dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

//         await axios
//             .post(
//                 "/auth/reset-password",
//                 {
//                     ...formValues,
//                 },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 },
//             )
//             .then(function (response) {
//                 console.log(response);
//                 dispatch(
//                     slice.actions.logIn({
//                         isLoggedIn: true,
//                         token: response.data.token,
//                     }),
//                 );
//                 dispatch(showSnackbar({ severity: "success", message: response.data.message }));
//                 dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
//             })
//             .catch(function (error) {
//                 console.log(error);
//                 dispatch(showSnackbar({ severity: "error", message: error.error.message }));
//                 dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
//             });
//     };
// }

// export function ForgotPassword(formValues) {
//     return async (dispatch, getState) => {
//         dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

//         await axios
//             .post(
//                 "/auth/forgot-password",
//                 {
//                     ...formValues,
//                 },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 },
//             )
//             .then(function (response) {
//                 console.log(response);

//                 dispatch(showSnackbar({ severity: "success", message: response.data.message }));
//                 dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
//             })
//             .catch(function (error) {
//                 console.log(error);
//                 dispatch(showSnackbar({ severity: "error", message: error.error.message }));
//                 dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
//             });
//     };
// }

export function LoginUser(formValues) {
    return async (dispatch, getState) => {
        // Make API call here

        dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

        await axios
            .post(
                '/auth/login',
                {
                    ...formValues,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then(function (response) {
                console.log(response);
                dispatch(
                    slice.actions.logIn({
                        isLoggedIn: true,
                        token: response.data.metadata.tokens.accessToken,
                        refreshToken: response.data.metadata.tokens.refreshToken,
                        user_id: response.data.metadata.user._id,
                    }),
                );
                window.localStorage.setItem('user_id', response.data.metadata.user._id);
                dispatch(showSnackbar({ severity: 'success', message: response.data.message }));
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({ severity: 'error', message: error.error.message }));
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
            });
    };
}

export function handleRefreshToken({ accessToken, refreshToken }) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.saveNewTokens({ accessToken, refreshToken }));
    };
}

export function LogoutUser() {
    return async (dispatch, getState) => {
        // Make API call here

        dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

        await axios
            .post('/auth/logout')
            .then((response) => {
                window.localStorage.removeItem('user_id');
                dispatch(slice.actions.signOut());
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({ severity: 'error', message: error.error.message }));
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
            });
    };
}

export function RegisterUser(formValues) {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

        await axios
            .post(
                '/auth/signup',
                {
                    ...formValues,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then(function (response) {
                console.log(response);
                dispatch(slice.actions.updateRegisterEmail({ email: response.data.metadata.user.usr_email }));
                dispatch(showSnackbar({ severity: 'success', message: response.data.message }));
                dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
            })
            .catch(function (error) {
                console.log(error);
                dispatch(showSnackbar({ severity: 'error', message: error.error.message }));
                dispatch(slice.actions.updateIsLoading({ error: true, isLoading: false }));
            })
            .finally(() => {
                if (!getState().auth.error) {
                    window.location.href = '/auth/verify';
                }
            });
    };
}

// export function VerifyEmail(formValues) {
//     return async (dispatch, getState) => {
//         dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

//         await axios
//             .post(
//                 "/auth/verify",
//                 {
//                     ...formValues,
//                 },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 },
//             )
//             .then(function (response) {
//                 console.log(response);
//                 dispatch(slice.actions.updateRegisterEmail({ email: "" }));
//                 window.localStorage.setItem("user_id", response.data.user_id);
//                 dispatch(
//                     slice.actions.logIn({
//                         isLoggedIn: true,
//                         token: response.data.token,
//                     }),
//                 );

//                 dispatch(showSnackbar({ severity: "success", message: response.data.message }));
//                 dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
//             })
//             .catch(function (error) {
//                 console.log(error);
//                 dispatch(showSnackbar({ severity: "error", message: error.error.message }));
//                 dispatch(slice.actions.updateIsLoading({ error: true, isLoading: false }));
//             });
//     };
// }
