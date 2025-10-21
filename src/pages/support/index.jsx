import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/admin/sidebar";
import HeaderLayout from "@/components/layout/admin/header";

const SupportLayout = () => {
    return (
        <>
            <HeaderLayout />
            <div style={{ display: "flex", height: "90vh" }}>
                <div style={{ width: "250px", borderRight: "1px solid #ddd" }}>
                    <Sidebar />
                </div>
                <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default SupportLayout;
