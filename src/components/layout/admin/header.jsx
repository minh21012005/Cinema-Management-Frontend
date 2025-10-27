import React, { useContext } from "react";
import logo from "@/assets/logo/logo.jpg";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Dropdown, message } from "antd";
import { useNavigate } from "react-router-dom";
import { logoutApi } from "@/services/api.service";
import { AuthContext } from "@/components/context/auth.context";

const HeaderLayout = () => {
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
            localStorage.removeItem("userId");
            localStorage.removeItem("chatSessionId");
            message.success("Đăng xuất thành công");
        }
    };

    const items = [
        {
            key: "username",
            label: <strong>{user.email}</strong>,
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
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                height: "60px",
                borderBottom: "1px solid #ddd",
                backgroundColor: "#fff",
            }}
        >
            <img src={logo} alt="Logo" style={{ height: "30px" }} />

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
        </header>
    );
};

export default HeaderLayout;
