import { Divider, IconButton, Stack } from '@mui/material';
import { GithubLogo, GoogleLogo, TwitterLogo } from 'phosphor-react';
import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '../../utils/firebase';
import { useDispatch } from 'react-redux';
import { AuthWithProvider } from '../../redux/auth/authActionCreators';
import { showSnackbar } from '../../redux/app/appActionCreators';

const AuthSocial = () => {
    const dispatch = useDispatch();

    const handleAuthGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // // This gives you a Google Access Token. You can use it to access the Google API.
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...

                const params = {
                    usr_email: user.providerData[0].email,
                    // usr_password: user.providerData[0].password,
                    usr_name: user.providerData[0].displayName,
                    usr_avatar: user.providerData[0].photoURL,
                    usr_provider_id: user.providerData[0].uid,
                    usr_provider_type: 'google',
                };

                // submit params to backend
                dispatch(AuthWithProvider(params));
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                dispatch(showSnackbar({ severity: 'error', message: errorMessage }));
            });
    };

    return (
        <div>
            <Divider
                sx={{
                    my: 2.5,
                    typography: 'overline',
                    color: 'text.disabled',
                    '&::before, ::after': {
                        borderTopStyle: 'dashed',
                    },
                }}
            >
                <span
                    onClick={() => {
                        // right order
                        window.open('https://shopee.vn/');
                        window.location.href = 'https://github.com/thientuquangtrung';
                    }}
                >
                    OR
                </span>
            </Divider>
            <Stack direction={'row'} justifyContent={'center'} spacing={2}>
                <a
                    onClick={() => {
                        window.open('https://github.com/thientuquangtrung');
                        window.open('https://shopee.vn/');
                    }}
                >
                    <GoogleLogo color="#df3e30" />
                </a>
                <a
                    href="https://github.com/thientuquangtrung"
                    target="_blank"
                    onClick={() => {
                        window.open('https://shopee.vn/');
                    }}
                    color="inherit"
                >
                    <GithubLogo />
                </a>
                <a
                    href="https://github.com/thientuquangtrung"
                    target="_self"
                    onClick={() => {
                        window.open('https://shopee.vn/');
                    }}
                >
                    <TwitterLogo color="#1c9cea" />
                </a>
            </Stack>
        </div>
    );
};

export default AuthSocial;
