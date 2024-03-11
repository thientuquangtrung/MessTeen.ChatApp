import axios from 'axios';
// config
import { BASE_URL } from '../config';
import { showSnackbar } from '../redux/app/appActionCreators';
import { handleRefreshToken } from '../redux/auth/authActionCreators';
import { revertAll } from '../redux/globalActions';
import { store } from '../redux/store';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } });

// Add a request interceptor
axiosInstance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        const state = store.getState();
        const userId = state.auth.user_id;
        const token = state.auth.token;
        if (userId && token) {
            config.headers['x-client-id'] = userId;
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    async (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data

        const state = store.getState();
        const userId = state.auth.user_id;
        const oldRefreshToken = state.auth.refreshToken;

        const { status, message } = response.data;
        if (status === 401) {
            if (message === 'jwt expired') {
                // axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${oldRefreshToken}`;

                const { accessToken, refreshToken } = await getNewTokens(userId, oldRefreshToken);
                if (accessToken) {
                    response.config.headers['Authorization'] = `Bearer ${accessToken}`;
                    store.dispatch(handleRefreshToken({ accessToken, refreshToken }));

                    return axiosInstance(response.config);
                }
            }
        }

        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            store.dispatch(revertAll());
            store.dispatch(
                showSnackbar({ severity: 'error', message: error.response?.data?.message || 'Something went wrong' }),
            );
        }
        return Promise.reject((error.response && error.response.data) || 'Something went wrong');
    },
);

const getNewTokens = async (userId, token) => {
    return (
        await axios.post(
            `${BASE_URL}auth/handle-refresh-token`,
            {},
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                    ['x-client-id']: userId,
                },
            },
        )
    ).data.metadata.tokens;
};

export default axiosInstance;
