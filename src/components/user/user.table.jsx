import { changeUserStatusAPI, fetchUser } from "@/services/api.service";
import { EyeOutlined } from "@ant-design/icons";
import { Popconfirm, Space, Switch, Table, Tag } from "antd";
import ModalUser from "./modal";
import { useState } from "react";

const UserTable = (props) => {

    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [dataUserDetail, setDataUserDetail] = useState(null);
    const { dataUser, loadUser, current, pageSize, total, setCurrent, setPageSize } = props;

    const columns = [
        {
            title: "STT",
            render: (_, record, index) => {
                return (
                    <div>{(index + 1) + (current - 1) * pageSize}</div>
                )
            }
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => text,
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role) => role?.name || "", // lấy name trong role object
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <EyeOutlined
                        onClick={() => {
                            handleViewDetail(record.id)
                        }}
                        style={{ cursor: "pointer", color: "#1677ff" }} />
                    <Popconfirm
                        title={`Xác nhận ${record.enabled ? "vô hiệu hóa" : "kích hoạt"} tài khoản?`}
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => changeStatus(record.id)}
                    >
                        <Switch
                            checked={record.enabled}
                            checkedChildren="Enabled"
                            unCheckedChildren="Disabled"
                            onClick={(e) => e.preventDefault()} // chặn đổi trạng thái ngay lập tức
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleViewDetail = async (userId) => {
        const res = await fetchUser(userId);
        if (res.data) {
            setDataUserDetail(res.data);
            setIsModalDetailOpen(true);
        }
    }


    const changeStatus = async (userId) => {
        try {
            await changeUserStatusAPI(userId);
            loadUser(); // reload user data after changing status
        } catch (error) {
            console.error("Failed to change user status:", error);
        }
    }

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current) {
            if (+pagination.current !== +current) {
                setCurrent(+pagination.current);
            }
        }

        if (pagination && pagination.pageSize) {
            if (+pagination.pageSize !== +pageSize) {
                setPageSize(+pagination.pageSize);
            }
        }
    };

    return (
        <>
            <Table columns={columns}
                dataSource={dataUser}
                rowKey={"id"}
                pagination={
                    {
                        current: current,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        total: total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }}
                onChange={onChange}
            />
            <ModalUser
                isModalDetailOpen={isModalDetailOpen}
                setIsModalDetailOpen={setIsModalDetailOpen}
                dataUserDetail={dataUserDetail}
                setDataUserDetail={setDataUserDetail}
            />
        </>
    )
}

export default UserTable;