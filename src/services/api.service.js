import axios from "./axios.customize";

const loginApi = (email, password) => {
    const URL_BACKEND = "/api/v1/auth/login";
    const data = {
        username: email,
        password: password
    }
    return axios.post(URL_BACKEND, data);
}

const logoutApi = () => {
    const URL_BACKEND = "/api/v1/auth/logout";
    return axios.post(URL_BACKEND);
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

const fetchAllUserAPI = (current, pageSize, email, role) => {
    return axios.get("/api/v1/users", {
        params: {
            page: current,
            size: pageSize,
            email: email || null, // nếu không có email thì truyền null
            role: role || null // nếu không có role thì truyền null
        }
    });
};

const changeUserStatusAPI = (userId) => {
    return axios.put(`/api/v1/users/change-status/${userId}`);
}

const fetchUser = (userId) => {
    return axios.get(`/api/v1/users/${userId}`);
}

const createUserApi = (name, email, password, phone, address, dateOfBirth, gender, roleId) => {
    const URL_BACKEND = "/api/v1/users/register";
    const data = {
        name: name,
        email: email,
        password: password,
        phone: phone,
        address: address,
        dateOfBirth: dateOfBirth,
        gender: gender,
        roleId: roleId
    }
    return axios.post(URL_BACKEND, data);
}

const fetchCinemaAPI = (current, pageSize, name) => {
    return axios.get("/api/v1/cinemas", {
        params: {
            page: current,
            size: pageSize,
            name: name || null // nếu không có tên thì truyền null
        }
    });
};

const fetchAllRoleAPI = () => {
    return axios.get("/api/v1/roles");
}

const createCinemaApi = (name, city, address, phone) => {
    const URL_BACKEND = "/api/v1/cinemas";
    const data = {
        name: name,
        city: city,
        address: address,
        phone: phone
    }
    return axios.post(URL_BACKEND, data);
}

const changeCinemaStatusAPI = (id) => {
    return axios.put(`/api/v1/cinemas/change-status/${id}`);
}

const updateCinemaApi = (id, name, city, address, phone) => {
    const URL_BACKEND = "api/v1/cinemas";
    const data = {
        id: id,
        name: name,
        city: city,
        address: address,
        phone: phone
    }
    return axios.put(URL_BACKEND, data);
}

const fetchAllRoomAPI = (id) => {
    return axios.get(`api/v1/cinemas/${id}/rooms`);
}

const fetchAllRoomTypeAPI = () => {
    return axios.get("api/v1/rooms/types");
}

const changeRoomStatusAPI = (id) => {
    return axios.put(`/api/v1/rooms/change-status/${id}`);
}

const findCinemaByIdAPI = (id) => {
    return axios.get(`api/v1/cinemas/${id}`);
}

const fetchRoomByIdAPI = (id) => {
    return axios.get(`api/v1/rooms/${id}`);
}

const updateRoomApi = (id, name, typeId) => {
    const URL_BACKEND = "api/v1/rooms";
    const data = {
        id: id,
        name: name,
        typeId: typeId
    }
    return axios.put(URL_BACKEND, data);
}

const fetchAllSeatByRoomIdAPI = (roomId) => {
    return axios.get(`api/v1/rooms/${roomId}/seats`);
}

const fetchAllSeatTypeAPI = () => {
    return axios.get("api/v1/seats/types");
}

const createRoomAPI = (cinemaId, name, roomTypeId, seats) => {
    const data = {
        cinemaId: cinemaId,
        name: name,
        roomTypeId: roomTypeId,
        seats: seats
    }
    return axios.post("api/v1/rooms", data);
}

const changeSeatStatusAPI = (id) => {
    return axios.put(`/api/v1/seats/change-status/${id}`);
}

const changeSeatTypeAPI = (id, typeId) => {
    const URL_BACKEND = `/api/v1/seats/${id}/type/${typeId}`;
    return axios.put(URL_BACKEND);
}

const createSeatAPI = (row, col, typeId, roomId) => {
    const URL_BACKEND = `/api/v1/seats`;
    const data = {
        row: row,
        col: col,
        typeId: typeId,
        roomId: roomId
    }
    return axios.post(URL_BACKEND, data);
}

export {
    loginApi, registerUserApi, getAccountApi, refreshTokenApi, fetchAllUserAPI, changeUserStatusAPI,
    fetchUser, logoutApi, createUserApi, fetchCinemaAPI, fetchAllRoleAPI, createCinemaApi, changeCinemaStatusAPI,
    updateCinemaApi, fetchAllRoomAPI, fetchAllRoomTypeAPI, changeRoomStatusAPI, findCinemaByIdAPI, fetchRoomByIdAPI,
    updateRoomApi, fetchAllSeatByRoomIdAPI, fetchAllSeatTypeAPI, createRoomAPI, changeSeatStatusAPI, changeSeatTypeAPI,
    createSeatAPI
}