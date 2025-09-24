import axios from "./axios.customize";

const loginApi = (email, password) => {
    const URL_BACKEND = "/auth-service/api/v1/auth/login";
    const data = {
        username: email,
        password: password
    }
    return axios.post(URL_BACKEND, data, {
        withCredentials: true // <-- bắt buộc để cookie được lưu
    });
}

const logoutApi = () => {
    const URL_BACKEND = "/auth-service/api/v1/auth/logout";
    return axios.post(URL_BACKEND);
}

const registerUserApi = (name, email, password, phone, address, dateOfBirth, gender) => {
    const URL_BACKEND = "/auth-service/api/v1/auth/register";
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
    const URL_BACKEND = "/auth-service/api/v1/auth/account";
    return axios.get(URL_BACKEND);
}

const refreshTokenApi = () => {
    return axios.post("/auth-service/api/v1/auth/refresh", {}, {
        withCredentials: true // gửi cookie refresh token lên server
    });
}

const fetchAllUserAPI = (current, pageSize, email, roleId) => {
    return axios.get("/user-service/api/v1/users", {
        params: {
            page: current,
            size: pageSize,
            email: email || null, // nếu không có email thì truyền null
            roleId: roleId || null // nếu không có role thì truyền null
        }
    });
};

const changeUserStatusAPI = (userId) => {
    return axios.put(`/auth-service/api/v1/users/change-status/${userId}`);
}

const fetchUser = (userId) => {
    return axios.get(`/user-service/api/v1/users/${userId}`);
}

const createUserApi = (name, email, password, phone, address, dateOfBirth, gender, roleId) => {
    const URL_BACKEND = "/user-service/api/v1/users";
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
    return axios.get("/cinema-service/api/v1/cinemas/fetch-all", {
        params: {
            page: current,
            size: pageSize,
            name: name || null // nếu không có tên thì truyền null
        }
    });
};

const fetchAllRoleAPI = () => {
    return axios.get("/auth-service/api/v1/roles");
}

const createCinemaApi = (name, city, address, phone) => {
    const URL_BACKEND = "/cinema-service/api/v1/cinemas";
    const data = {
        name: name,
        city: city,
        address: address,
        phone: phone
    }
    return axios.post(URL_BACKEND, data);
}

const changeCinemaStatusAPI = (id) => {
    return axios.put(`/cinema-service/api/v1/cinemas/change-status/${id}`);
}

const updateCinemaApi = (id, name, city, address, phone) => {
    const URL_BACKEND = `/cinema-service/api/v1/cinemas/${id}`;
    const data = {
        name: name,
        city: city,
        address: address,
        phone: phone
    }
    return axios.put(URL_BACKEND, data);
}

const fetchAllRoomAPI = (id) => {
    return axios.get(`/cinema-service/api/v1/rooms/cinemas/${id}`);
}

const fetchAllRoomTypeAPI = () => {
    return axios.get("/cinema-service/api/v1/rooms/types");
}

const changeRoomStatusAPI = (id) => {
    return axios.put(`/cinema-service/api/v1/rooms/change-status/${id}`);
}

const findCinemaByIdAPI = (id) => {
    return axios.get(`/cinema-service/api/v1/cinemas/${id}`);
}

const fetchRoomByIdAPI = (id) => {
    return axios.get(`/cinema-service/api/v1/rooms/${id}`);
}

const updateRoomApi = (id, name, typeId) => {
    const URL_BACKEND = `/cinema-service/api/v1/rooms/${id}`;
    const data = {
        name: name,
        typeId: typeId
    }
    return axios.put(URL_BACKEND, data);
}

const fetchAllSeatByRoomIdAPI = (roomId) => {
    return axios.get(`/cinema-service/api/v1/seats/rooms/${roomId}`);
}

const fetchAllSeatTypeAPI = () => {
    return axios.get("/cinema-service/api/v1/seats/types");
}

const createRoomAPI = (cinemaId, name, roomTypeId, seats) => {
    const data = {
        cinemaId: cinemaId,
        name: name,
        roomTypeId: roomTypeId,
        seats: seats
    }
    return axios.post("/cinema-service/api/v1/rooms/create", data);
}

const changeSeatStatusAPI = (id) => {
    return axios.put(`/cinema-service/api/v1/seats/change-status/${id}`);
}

const changeSeatTypeAPI = (id, typeId) => {
    const URL_BACKEND = `/cinema-service/api/v1/seats/${id}/type/${typeId}`;
    return axios.put(URL_BACKEND);
}

const createSeatAPI = (row, col, typeId, roomId) => {
    const URL_BACKEND = `/cinema-service/api/v1/seats`;
    const data = {
        row: row,
        col: col,
        typeId: typeId,
        roomId: roomId
    }
    return axios.post(URL_BACKEND, data);
}

const fetchAllMoviesAPI = (current, pageSize, title, categoryId) => {
    return axios.get("/movie-service/api/v1/movies/all", {
        params: {
            page: current,
            size: pageSize,
            title: title || null, // nếu không có tên thì truyền null
            categoryId: categoryId || null // nếu không có category thì truyền null
        }
    });
}

const fetchShowtimeByCinemaAPI = (id, current, pageSize, title, roomId, fromDate, toDate) => {
    const URL_BACKEND = `/cinema-service/api/v1/showtime/cinemas/${id}`;
    return axios.get(URL_BACKEND, {
        params: {
            page: current,
            size: pageSize,
            title: title || null,
            roomId: roomId || null,
            fromDate: fromDate || null,
            toDate: toDate || null
        }
    });
}

const fetchRoomByCinemaAPI = (id) => {
    return axios.get(`/cinema-service/api/v1/rooms/cinemas/${id}`);
}

const fetchActiveMovies = () => {
    return axios.get(`/movie-service/api/v1/movies/active`);
}

const createShowtimeAPI = (roomId, movieId, startTime) => {
    const URL_BACKEND = `/cinema-service/api/v1/showtime`;
    const data = {
        roomId: roomId,
        movieId: movieId,
        startTime: startTime
    }
    return axios.post(URL_BACKEND, data);
}

const changeShowtimeStatusAPI = (id) => {
    return axios.put(`/cinema-service/api/v1/showtime/change-status/${id}`);
}

const updateShowtimeAPI = (id, roomId, movieId, startTime) => {
    const URL_BACKEND = `/cinema-service/api/v1/showtime/${id}`;
    const data = {
        roomId: roomId,
        movieId: movieId,
        startTime: startTime
    };
    return axios.put(URL_BACKEND, data);
}

const fetchAllCategoryActive = () => {
    return axios.get(`/movie-service/api/v1/categories/all`);
}

const uploadFileAPI = (file, type) => {
    const URL_BACKEND = `media-service/api/v1/media/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    return axios.post(URL_BACKEND, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const getMediaUrlAPI = (objectKey) => {
    const URL_BACKEND = `media-service/api/v1/media/url`;
    return axios.get(URL_BACKEND, {
        params: {
            objectKey: objectKey,
            expireSeconds: 3600
        }
    });
};

const createMovieAPI = (title, description, durationInMinutes, releaseDate, endDate, posterKey, categoryIds) => {
    const URL_BACKEND = "/movie-service/api/v1/movies";
    const data = {
        title: title,
        description: description,
        durationInMinutes: durationInMinutes,
        releaseDate: releaseDate,
        endDate: endDate || null,
        posterKey: posterKey,
        categoryIds: categoryIds
    };
    return axios.post(URL_BACKEND, data);
}

export {
    loginApi, registerUserApi, getAccountApi, refreshTokenApi, fetchAllUserAPI, changeUserStatusAPI,
    fetchUser, logoutApi, createUserApi, fetchCinemaAPI, fetchAllRoleAPI, createCinemaApi, changeCinemaStatusAPI,
    updateCinemaApi, fetchAllRoomAPI, fetchAllRoomTypeAPI, changeRoomStatusAPI, findCinemaByIdAPI, fetchRoomByIdAPI,
    updateRoomApi, fetchAllSeatByRoomIdAPI, fetchAllSeatTypeAPI, createRoomAPI, changeSeatStatusAPI, changeSeatTypeAPI,
    createSeatAPI, fetchAllMoviesAPI, fetchShowtimeByCinemaAPI, fetchRoomByCinemaAPI, fetchActiveMovies, createShowtimeAPI,
    changeShowtimeStatusAPI, updateShowtimeAPI, fetchAllCategoryActive, uploadFileAPI, createMovieAPI, getMediaUrlAPI
}