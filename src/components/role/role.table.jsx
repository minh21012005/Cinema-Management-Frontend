import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { Space, Table, Tag } from "antd";
import { useState } from "react";

const RoleTable = (props) => {
    const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
    const [dataRoleDetail, setDataRoleDetail] = useState(null);

    const { dataRole, loadRole, current, pageSize, total, setCurrent, setPageSize, onEdit } = props;

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Code", dataIndex: "code", key: "code" },
        { title: "Name", dataIndex: "name", key: "name" },
        {
            title: "Status",
            dataIndex: "active",
            key: "active",
            render: (active) => (
                <Tag color={active ? "green" : "red"}>
                    {active ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <EyeOutlined
                        style={{ cursor: "pointer", color: "#1677ff" }}
                        onClick={() => {
                            setDataRoleDetail(record);
                            setIsModalDetailOpen(true);
                        }}
                    />
                    <EditOutlined
                        style={{ cursor: "pointer", color: "#faad14" }}
                        onClick={() => onEdit(record)} // gọi hàm update từ props
                    />
                </Space>
            ),
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current) {
            const newCurrent = pagination.current - 1; // convert 1-based (Antd) -> 0-based (API)
            if (newCurrent !== current) {
                setCurrent(newCurrent);
            }
        }

        if (pagination && pagination.pageSize) {
            if (pagination.pageSize !== pageSize) {
                setPageSize(pagination.pageSize);
            }
        }
    };

    return (
        <>
            <Table
                columns={columns}
                dataSource={dataRole}
                rowKey="id"
                pagination={{
                    current: current + 1,
                    pageSize,
                    showSizeChanger: true,
                    total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} rows`,
                }}
                onChange={onChange}
            />
        </>
    );
};

export default RoleTable;
