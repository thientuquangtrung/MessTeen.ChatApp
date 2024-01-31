import axios from "axios";
// config
import { BASE_URL } from "../config";
// import { store } from "../redux/store";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BASE_URL });

// Add a request interceptor
// axiosInstance.interceptors.request.use(
//     function (config) {
//         // Do something before request is sent
//         const userId = localStorage.getItem("user_id");
//         if (userId) {
//             config.headers["x-client-id"] = userId;
//         }
//         return config;
//     },
//     function (error) {
//         // Do something with request error
//         return Promise.reject(error);
//     },
// );

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || "Something went wrong"),
);

export default axiosInstance;
