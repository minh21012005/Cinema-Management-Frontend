import axios from "axios";
import NProgress from 'nprogress';
import { refreshTokenApi } from "./api.service";

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
}, async function (error) {
    NProgress.done();

    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
        console.log("Access token expired, trying to refresh...");
        // Đánh dấu request đã retry để tránh vòng lặp vô hạn
        originalRequest._retry = true;
        try {
            // Gọi API refresh token
            const res = await refreshTokenApi();
            if (res?.data?.access_token) {
                // Lưu token mới
                window.localStorage.setItem("access_token", res.data.access_token);
                // Gắn token mới vào request cũ
                originalRequest.headers['Authorization'] = 'Bearer ' + res.data.access_token;
                // Retry request cũ
                return instance(originalRequest);
            } else {
                window.localStorage.removeItem("access_token");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            // Xử lý logout nếu cần
        }
    }

    if (error.response && error.response.data) return error.response.data;
    return Promise.reject(error);
});

export default instance;
