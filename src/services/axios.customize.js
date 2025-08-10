import axios from "axios";
import NProgress from 'nprogress';

NProgress.configure({
    showSpinner: false,
    trickleSpeed: 100,
});

// Tạo instance mặc định
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

// Interceptor request
instance.interceptors.request.use(function (config) {
    NProgress.start();

    // Danh sách API public (không cần token)
    const publicPaths = [
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/api/v1/auth/refresh"
    ];

    // Kiểm tra nếu URL thuộc public API
    const isPublicAPI = publicPaths.some(path => config.url.includes(path));

    // Chỉ gắn Authorization nếu không phải public API
    if (!isPublicAPI && typeof window !== "undefined" && window.localStorage.getItem('access_token')) {
        config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
    }
    // Do something before request is sent
    return config;
}, function (error) {
    NProgress.done();
    // Do something with request error
    return Promise.reject(error);
});


// Add a response interceptor
instance.interceptors.response.use(function (response) {
    NProgress.done();
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data && response.data.data) return response.data;
    return response;
}, function (error) {
    NProgress.done();
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.data) return error.response.data;
    return Promise.reject(error);
});

export default instance;
