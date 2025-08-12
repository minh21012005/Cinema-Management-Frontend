import Sidebar from "../../components/layout/admin/sidebar";
import HeaderLayout from "../../components/layout/admin/header";
import { useEffect, useState } from "react";

const StaffPage = () => {

    return (
        <>
            <HeaderLayout />
            <div style={{ display: 'flex', height: '100vh' }}>
                <div style={{ width: '250px', borderRight: '1px solid #ddd' }}>
                    <Sidebar />
                </div>
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>

                </div>
            </div>
        </>
    );
};

export default StaffPage;