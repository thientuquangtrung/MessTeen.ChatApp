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
                OR
            </Divider>
            <Stack direction={'row'} justifyContent={'center'} spacing={2}>
                <IconButton onClick={handleAuthGoogle}>
                    <GoogleLogo color="#df3e30" />
                </IconButton>
                <IconButton
                    onClick={() => {
                        window.open('https://github.com/thientuquangtrung', '_blank');
                        window.open(
                            'https://shopee.vn/%E2%9A%A1%EF%B8%8F-Gi%C3%A1-S%E1%BB%91c-%E2%9A%A1%EF%B8%8FTh%E1%BA%AFt-l%C6%B0ng-nam-da-cao-c%E1%BA%A5p-kh%C3%B3a-kim-lo%E1%BA%A1i-t%E1%BB%B1-%C4%91%E1%BB%99ng-kh%C3%B4ng-g%E1%BB%89-Cam-k%E1%BA%BFt-1-%C4%91%E1%BB%95i-1-b%E1%BA%A3o-h%C3%A0nh-12-th%C3%A1ng-i.493704632.23263153105?publish_id=&sp_atk=419297ab-008a-40fd-9eba-0531b11a4678&xptdk=419297ab-008a-40fd-9eba-0531b11a4678',
                            '_blank',
                        );
                        // window.location.href =
                        //     'https://shopee.vn/%E2%9A%A1%EF%B8%8F-Gi%C3%A1-S%E1%BB%91c-%E2%9A%A1%EF%B8%8FTh%E1%BA%AFt-l%C6%B0ng-nam-da-cao-c%E1%BA%A5p-kh%C3%B3a-kim-lo%E1%BA%A1i-t%E1%BB%B1-%C4%91%E1%BB%99ng-kh%C3%B4ng-g%E1%BB%89-Cam-k%E1%BA%BFt-1-%C4%91%E1%BB%95i-1-b%E1%BA%A3o-h%C3%A0nh-12-th%C3%A1ng-i.493704632.23263153105?publish_id=&sp_atk=419297ab-008a-40fd-9eba-0531b11a4678&xptdk=419297ab-008a-40fd-9eba-0531b11a4678';
                    }}
                    color="inherit"
                >
                    <GithubLogo />
                </IconButton>
                <IconButton>
                    <TwitterLogo color="#1c9cea" />
                </IconButton>
            </Stack>
        </div>
    );
};

export default AuthSocial;
