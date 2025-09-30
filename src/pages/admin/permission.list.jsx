import PermissionCreateModal from "@/components/permission/permission.create";
import PermissionTable from "@/components/permission/permission.table";
import { fetchPermissionsWithPaginationAPI } from "@/services/api.service";
import { Button, Space } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";

const PermissionListPage = () => {

    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [permissionSearch, setPermissionSearch] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataPermission, setDataPermission] = useState([]);

    useEffect(() => { loadPermission(); }, [current, pageSize, permissionSearch]);

    const onSearch = (value, _e, info) => {
        if (value) {
            let trimmedValue = value.trim();
            setPermissionSearch(trimmedValue);
            setCurrent(); // reset về trang đầu tiên khi tìm kiếm
        } else {
            setPermissionSearch(null); // nếu không có giá trị tìm kiếm thì reset
            setCurrent(0); // reset về trang đầu tiên
        }
    }

    const loadPermission = async () => {
        const res = await fetchPermissionsWithPaginationAPI(current, pageSize, permissionSearch);
        if (res && res.data) {
            setDataPermission(res.data.result);
            setCurrent(res.data.meta.page);
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.total);
        }
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '350px' }}>
                    <Space direction="vertical">
                        <Search
                            placeholder="Nhập module..."
                            allowClear
                            onSearch={onSearch}
                            style={{ width: 200 }}
                        />
                    </Space>
                </div>

                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Create Permission
                </Button>
            </div>
            <PermissionTable
                dataPermission={dataPermission}
                loadPermission={loadPermission}
                current={current}
                pageSize={pageSize}
                total={total}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
            />
            <PermissionCreateModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                loadPermission={loadPermission}
            />
        </>
    );
};

export default PermissionListPage;