// src/pages/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/admin/sidebar";
import HeaderLayout from "@/components/layout/admin/header";

const AdminLayout = () => {
    return (
        <>
            <HeaderLayout />
            <div style={{ display: "flex", height: "90vh" }}>
                <div style={{ width: "250px", borderRight: "1px solid #ddd" }}>
                    <Sidebar />
                </div>
                <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                    {/* Nơi render trang con */}
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
