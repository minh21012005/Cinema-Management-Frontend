// src/components/Header.jsx
import React from "react";
import "@/styles/header.css";
import { useContext } from "react";
import { AuthContext } from "@/components/context/auth.context";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, message } from "antd";
import { logoutApi } from "@/services/api.service";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const { user, setUser } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await logoutApi();
        } catch (err) {
            console.error(err);
        } finally {
            setUser(null);
            navigate("/");
            localStorage.removeItem("access_token");
            message.success("Đăng xuất thành công");
        }
    };

    const items = [
        {
            key: "username",
            label: <strong>{user?.email}</strong>,
        },
        {
            type: "divider",
        },
        {
            key: "logout",
            label: "Logout",
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <header className="site-header">
            <img className="header-logo" src="/logo.svg" alt="logo" />
            <nav className="header-nav">
                <a href="/">Trang chủ</a>
                <a href="#">Phim</a>
                <a href="#">Lịch chiếu</a>
                <a href="#">Ưu đãi</a>
                <a href="#">Liên hệ</a>
            </nav>
            <div className="header-actions">
                {
                    !user ? <a href="/login" className="login-link">Đăng nhập</a>
                        :
                        <Dropdown
                            menu={{ items }}
                            placement="bottomRight"
                            arrow
                            trigger={["click"]}
                        >
                            <UserOutlined
                                style={{ fontSize: "20px", cursor: "pointer" }}
                            />
                        </Dropdown>
                }

            </div>
        </header>
    );
};

export default Header;
