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

export {
    loginApi, registerUserApi
}