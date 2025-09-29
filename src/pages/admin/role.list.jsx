import RoleCreateModal from "@/components/role/role.create";
import RoleTable from "@/components/role/role.table";
import { fetchPermissionsActiveAPI, fetchRolesWithPaginationAPI } from "@/services/api.service";
import { Button, Space } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";

const RoleListPage = () => {

    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [dataRole, setDataRole] = useState([]);
    const [roleSearch, setRoleSearch] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listPermission, setListPermission] = useState([]);

    useEffect(() => { loadRole(); }, [current, pageSize, roleSearch]);
    useEffect(() => { fetchPermissionList(); }, []);

    const loadRole = async () => {
        const res = await fetchRolesWithPaginationAPI(current, pageSize, roleSearch);
        if (res && res.data) {
            setDataRole(res.data.result);
            setCurrent(res.data.meta.page);
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.total);
        }
    }

    const fetchPermissionList = async () => {
        const res = await fetchPermissionsActiveAPI();
        if (res && res.data) {
            setListPermission(res.data);
        }
    }

    const onSearch = (value, _e, info) => {
        if (value) {
            let trimmedValue = value.trim();
            setRoleSearch(trimmedValue);
            setCurrent(); // reset về trang đầu tiên khi tìm kiếm
        } else {
            setRoleSearch(null); // nếu không có giá trị tìm kiếm thì reset
            setCurrent(0); // reset về trang đầu tiên
        }
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '350px' }}>
                    <Space direction="vertical">
                        <Search
                            placeholder="Nhập name..."
                            allowClear
                            onSearch={onSearch}
                            style={{ width: 200 }}
                        />
                    </Space>
                </div>

                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Create Role
                </Button>
            </div>
            <RoleTable
                current={current}
                pageSize={pageSize}
                total={total}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
                dataRole={dataRole}
                roleSearch={roleSearch}
            />
            <RoleCreateModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                loadRole={loadRole}
                listPermission={listPermission}
            />
        </>
    );
}

export default RoleListPage;