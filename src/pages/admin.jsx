import Sidebar from "../components/layout/admin/sidebar";
import UserTable from "../components/user/user.table";
import HeaderLayout from "../components/layout/admin/header";
import { useEffect, useState } from "react";
import { fetchAllUserAPI } from "@/services/api.service";

const AdminPage = () => {

    const [dataUser, setDataUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => { loadUser() }, [current, pageSize]);

    const loadUser = async () => {
        const res = await fetchAllUserAPI(current, pageSize);
        if (res.data) {
            setDataUser(res.data.result);
            setCurrent(res.data.meta.page);
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.total);
        }

    }

    return (
        <>
            <HeaderLayout />
            <div style={{ display: 'flex', height: '100vh' }}>
                <div style={{ width: '250px', borderRight: '1px solid #ddd' }}>
                    <Sidebar />
                </div>
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                    <UserTable
                        loadUser={loadUser}
                        dataUser={dataUser}
                        current={current}
                        pageSize={pageSize}
                        total={total}
                        setCurrent={setCurrent}
                        setPageSize={setPageSize}
                    />
                </div>
            </div>
        </>
    );
};

export default AdminPage;