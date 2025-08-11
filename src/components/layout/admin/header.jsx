import React from "react";
import logo from "@/assets/logo/logo.jpg";
import { UserOutlined } from "@ant-design/icons";

const HeaderLayout = () => {
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
            <UserOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
        </header>
    );
};

export default HeaderLayout;
