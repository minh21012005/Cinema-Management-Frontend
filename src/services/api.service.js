import axios from "./axios.customize";

const loginApi = (email, password) => {
    const URL_BACKEND = "/api/v1/auth/login";
    const data = {
        username: email,
        password: password,
        delay: 1000
    }

    return axios.post(URL_BACKEND, data);
}

const registerUserApi = (name, email, password, phone, address, dateOfBirth, gender) => {
    const URL_BACKEND = "/api/v1/auth/register";
    const data = {
        name: name,
        email: email,
        password: password,
        phone: phone,
        address: address,
        dateOfBirth: dateOfBirth,
        gender: gender
    }
    return axios.post(URL_BACKEND, data);
}

const getAccountApi = () => {
    const URL_BACKEND = "/api/v1/auth/account";
    return axios.get(URL_BACKEND);
}

const refreshTokenApi = () => {
    return axios.post("/api/v1/auth/refresh", {}, {
        withCredentials: true // gửi cookie refresh token lên server
    });
}

const fetchAllUserAPI = (current, pageSize) => {
    return axios.get("/api/v1/users", {
        params: {
            current: current,
            pageSize: pageSize
        }
    });
};

export {
    loginApi, registerUserApi, getAccountApi, refreshTokenApi, fetchAllUserAPI
}