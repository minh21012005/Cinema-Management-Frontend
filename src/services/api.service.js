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

const registerRequestApi = (data) => {
    const URL_BACKEND = "/auth-service/api/v1/auth/register-request";
    return axios.post(URL_BACKEND, data);
};

const verifyOtpApi = (data) => {
    const URL_BACKEND = "/auth-service/api/v1/auth/register-verify";
    return axios.post(URL_BACKEND, data);
};

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

const createUserApi = (name, email, password, phone, address, dateOfBirth, gender, roleId, cinemaId) => {
    const URL_BACKEND = "/user-service/api/v1/users";
    const data = {
        name: name,
        email: email,
        password: password,
        phone: phone,
        address: address,
        dateOfBirth: dateOfBirth,
        gender: gender,
        roleId: roleId,
        cinemaId: cinemaId
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

const fetchActiveCinemasAPI = () => {
    return axios.get("/cinema-service/api/v1/cinemas/active")
}

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

const fetchAllMoviesAPI = (current, pageSize, title, categoryId, fromDate, toDate) => {
    return axios.get("/movie-service/api/v1/movies/all", {
        params: {
            page: current,
            size: pageSize,
            title: title || null, // nếu không có tên thì truyền null
            categoryId: categoryId || null, // nếu không có category thì truyền null,
            fromDate: fromDate || null,
            toDate: toDate || null
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

const getMediaUrlAPI = (objectKey) => {
    const URL_BACKEND = `media-service/api/v1/media/url`;
    return axios.get(URL_BACKEND, {
        params: {
            objectKey: objectKey,
            expireSeconds: 3600
        }
    });
};

const createMovieAPI = (title, description, durationInMinutes, releaseDate, endDate, posterKey, categoryIds, trailerUrl, director, cast) => {
    const URL_BACKEND = "/movie-service/api/v1/movies";
    const data = {
        title: title,
        description: description,
        durationInMinutes: durationInMinutes,
        releaseDate: releaseDate,
        endDate: endDate || null,
        posterKey: posterKey,
        categoryIds: categoryIds,
        trailerUrl: trailerUrl || null,
        director: director,
        cast: cast || null
    };
    return axios.post(URL_BACKEND, data);
}

const uploadTempFileAPI = (file) => {
    const URL_BACKEND = `media-service/api/v1/media/upload/temp`;
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(URL_BACKEND, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

const commitFileAPI = (objectKey, type) => {
    const URL_BACKEND = `media-service/api/v1/media/commit`;
    return axios.post(URL_BACKEND, null, {
        params: {
            objectKey: objectKey,
            type: type
        }
    });
};

const changeMovieStatusAPI = (id) => {
    return axios.put(`/movie-service/api/v1/movies/change-status/${id}`);
}

const updateMovieAPI = (id, title, description, durationInMinutes, releaseDate, endDate, posterKey, categoryIds, trailerUrl, director, cast) => {
    const URL_BACKEND = `/movie-service/api/v1/movies/${id}`;
    const data = {
        title: title,
        description: description,
        durationInMinutes: durationInMinutes,
        releaseDate: releaseDate,
        endDate: endDate || null,
        posterKey: posterKey,
        categoryIds: categoryIds,
        trailerUrl: trailerUrl || null,
        director: director,
        cast: cast || null
    };
    return axios.put(URL_BACKEND, data);
}

const deleteFileAPI = (key) => {
    return axios.delete(`/media-service/api/v1/media`, {
        params: {
            key: key
        }
    });
};

const fetchAllFoodAPI = (current, pageSize, name, typeId) => {
    return axios.get("/cinema-service/api/v1/foods/all", {
        params: {
            page: current,
            size: pageSize,
            name: name || null, // nếu không có tên thì truyền null
            typeId: typeId || null // nếu không có loại thì truyền null
        }
    });
}

const createFoodAPI = (code, name, price, description, imageKey, typeId, available) => {
    const URL_BACKEND = "/cinema-service/api/v1/foods";
    const data = {
        code: code,
        name: name,
        price: price,
        description: description || null,
        imageKey: imageKey,
        typeId: typeId,
        available: available
    };
    return axios.post(URL_BACKEND, data);
}

const fetchFoodTypeActiveAPI = () => {
    return axios.get("/cinema-service/api/v1/foodtypes/active");
}

const updateFoodAPI = (id, code, name, price, description, imageKey, typeId, available) => {
    const URL_BACKEND = `/cinema-service/api/v1/foods/${id}`;
    const data = {
        code: code,
        name: name,
        price: price,
        description: description || null,
        imageKey: imageKey,
        typeId: typeId,
        available: available
    };
    return axios.put(URL_BACKEND, data);
}

const fetchAllFoodsActiveAPI = () => {
    return axios.get("/cinema-service/api/v1/foods/active");
}

const fetchAllCombosActiveAPI = () => {
    return axios.get("/cinema-service/api/v1/combos/active");
}

const fetchAllCombosAPI = (current, pageSize, name) => {
    return axios.get("/cinema-service/api/v1/combos/all", {
        params: {
            page: current,
            size: pageSize,
            name: name || null, // nếu không có tên thì truyền null
        }
    });
}

const createComboAPI = (name, price, description, imageKey, available, foods) => {
    const URL_BACKEND = "/cinema-service/api/v1/combos";
    const data = {
        name: name,
        price: price,
        description: description || null,
        imageKey: imageKey,
        available: available,
        foods: foods || [] // [{ foodId: 1, quantity: 2 }]
    };
    return axios.post(URL_BACKEND, data);
};

const updateComboAPI = (id, name, price, description, imageKey, available, foods) => {
    const URL_BACKEND = `/cinema-service/api/v1/combos/${id}`;
    const data = {
        name: name,
        price: price,
        description: description || null,
        imageKey: imageKey,
        available: available,
        foods: foods || [] // [{ foodId: 1, quantity: 2 }]
    };
    return axios.put(URL_BACKEND, data);
};

const fetchRolesWithPaginationAPI = (current, pageSize, code) => {
    return axios.get("/auth-service/api/v1/roles/all", {
        params: {
            page: current,
            size: pageSize,
            code: code || null, // nếu không có tên thì truyền null
        }
    });
}

const fetchPermissionsActiveAPI = () => {
    return axios.get("/auth-service/api/v1/permissions/active");
}

const createRoleAPI = (name, code, description, active, permissionIds) => {
    const URL_BACKEND = "/auth-service/api/v1/roles";
    const data = {
        name: name,
        code: code,
        description: description || null,
        active: active || true,
        permissionIds: permissionIds || []
    };
    return axios.post(URL_BACKEND, data);
};

const updateRoleAPI = (id, payload) => {
    const URL_BACKEND = `/auth-service/api/v1/roles/${id}`;
    return axios.put(URL_BACKEND, payload);
}

const fetchPermissionsWithPaginationAPI = (current, pageSize, module) => {
    return axios.get("/auth-service/api/v1/permissions/all", {
        params: {
            page: current,
            size: pageSize,
            module: module || null, // nếu không có tên thì truyền null
        }
    });
}

const createPermissionAPI = (name, code, method, apiPath, module, description, active) => {
    const URL_BACKEND = "/auth-service/api/v1/permissions";
    const data = {
        name: name,
        code: code,
        method: method,
        apiPath: apiPath,
        module: module,
        description: description || null,
        active: active || true
    };
    return axios.post(URL_BACKEND, data);
};

const updatePermissionAPI = (id, payload) => {
    const URL_BACKEND = `/auth-service/api/v1/permissions/${id}`;
    return axios.put(URL_BACKEND, payload);
};

const fetchShowtimeInDayForStaffAPI = (current, pageSize, title) => {
    return axios.get("/cinema-service/api/v1/showtime/inday", {
        params: {
            page: current,
            size: pageSize,
            title: title || null
        }
    });
}

const fetchSeatLayoutAPI = (id) => {
    return axios.get(`/cinema-service/api/v1/seats/fetch-by-showtime/${id}`);
}

const staffHandleBookingAPI = (payload) => {
    const URL_BACKEND = `/booking-service/api/v1/orders`;
    return axios.post(URL_BACKEND, payload);
}

const fetchQrCode = (amount, orderId) => {
    return axios.get("/booking-service/api/v1/sepay/generate-qr", {
        params: {
            amount: amount,
            orderId: orderId
        }
    });
}

const fetchShowingMoviesAPI = (limit) => {
    return axios.get("/movie-service/api/v1/movies/showing", {
        params: { limit },
    });
};

const fetchComingSoonMoviesAPI = (limit) => {
    return axios.get("/movie-service/api/v1/movies/coming-soon", {
        params: { limit },
    });
};

const createBannerAPI = (payload) => {
    const URL_BACKEND = "/content-service/api/v1/banners";
    return axios.post(URL_BACKEND, payload);
}

const fetchAllBannerAPI = (current, pageSize, titleSearch) => {
    return axios.get("/content-service/api/v1/banners/all", {
        params: {
            page: current,
            size: pageSize,
            title: titleSearch || null, // nếu không có tên thì truyền null
        }
    });
}

const fetchAllBannersActiveAPI = () => {
    return axios.get("/content-service/api/v1/banners/active");
}

const updateBannerAPI = (id, data) => {
    const URL_BACKEND = `/content-service/api/v1/banners/${id}`;
    return axios.put(URL_BACKEND, data);
}

const fetchMovieByIdAPI = (id) => {
    return axios.get(`/movie-service/api/v1/movies/fetch/${id}`);
}

const fetchShowtimeByMovieAPI = (id, params) => {
    return axios.get(`/cinema-service/api/v1/showtime/movie/${id}`, { params });
}

const bookingAPI = (payload) => {
    const URL_BACKEND = `/booking-service/api/v1/orders/booking`;
    return axios.post(URL_BACKEND, payload);
}

export {
    loginApi, registerUserApi, getAccountApi, refreshTokenApi, fetchAllUserAPI, changeUserStatusAPI,
    fetchUser, logoutApi, createUserApi, fetchCinemaAPI, fetchAllRoleAPI, createCinemaApi, changeCinemaStatusAPI,
    updateCinemaApi, fetchAllRoomAPI, fetchAllRoomTypeAPI, changeRoomStatusAPI, findCinemaByIdAPI, fetchRoomByIdAPI,
    updateRoomApi, fetchAllSeatByRoomIdAPI, fetchAllSeatTypeAPI, createRoomAPI, changeSeatStatusAPI, changeSeatTypeAPI,
    createSeatAPI, fetchAllMoviesAPI, fetchShowtimeByCinemaAPI, fetchRoomByCinemaAPI, fetchActiveMovies, createShowtimeAPI,
    changeShowtimeStatusAPI, updateShowtimeAPI, fetchAllCategoryActive, createMovieAPI, getMediaUrlAPI, uploadTempFileAPI,
    commitFileAPI, changeMovieStatusAPI, updateMovieAPI, deleteFileAPI, fetchAllFoodAPI, createFoodAPI, fetchFoodTypeActiveAPI,
    updateFoodAPI, fetchAllCombosAPI, createComboAPI, fetchAllFoodsActiveAPI, updateComboAPI, fetchRolesWithPaginationAPI,
    fetchPermissionsActiveAPI, createRoleAPI, updateRoleAPI, fetchPermissionsWithPaginationAPI, createPermissionAPI,
    updatePermissionAPI, fetchShowtimeInDayForStaffAPI, fetchSeatLayoutAPI, fetchAllCombosActiveAPI, staffHandleBookingAPI,
    fetchQrCode, fetchActiveCinemasAPI, registerRequestApi, verifyOtpApi, fetchShowingMoviesAPI, fetchComingSoonMoviesAPI,
    createBannerAPI, fetchAllBannerAPI, fetchAllBannersActiveAPI, updateBannerAPI, fetchMovieByIdAPI, fetchShowtimeByMovieAPI,
    bookingAPI
}