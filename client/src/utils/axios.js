import axios from "axios";
// config
import { BASE_URL } from "../config";
import { store } from "../redux/store";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BASE_URL });

// Add a request interceptor
axiosInstance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        const state = store.getState();
        const userId = state.auth.user_id;
        const token = state.auth.token;
        if (userId && token) {
            config.headers["x-client-id"] = userId;
            config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || "Something went wrong"),
);

export default axiosInstance;
