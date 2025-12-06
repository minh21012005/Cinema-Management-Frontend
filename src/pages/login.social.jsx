import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import { AuthContext } from "../components/context/auth.context";
import { refreshTokenApi } from "@/services/api.service";

const SocialLogin = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const res = await refreshTokenApi();
        if (res.data) {
            message.success("Đăng nhập thành công");
            localStorage.removeItem("chatSessionId");
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("userId", res.data.user.id);
            setUser(res.data.user);
            if (res.data.user.role.name === 'ADMIN') {
                navigate("/admin");
            } else if (res.data.user.role.name === 'MANAGER') {
                navigate("/manager");
            }
            else if (res.data.user.role.name === 'STAFF') {
                navigate("/staff");
            }
            else if (res.data.user.role.name === 'SUPPORT') {
                navigate("/support");
            }
            else {
                navigate("/");
            }
        } else {
            message.error("Đăng nhập không thành công");
            navigate("/login");
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Spin size="large" />
        </div >
    );
};

export default SocialLogin;