import { EditOutlined } from "@ant-design/icons";
import { Space, Table, Tag } from "antd";
import { render } from "nprogress";
import { useState } from "react";

const PermissionTable = (props) => {
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [permissionData, setPermissionData] = useState(null);

    const { dataPermission, loadPermission, current, pageSize, total, setCurrent, setPageSize } = props;

    const methodColors = {
        GET: "green",
        POST: "blue",
        PUT: "orange",
        DELETE: "red",
        PATCH: "purple",
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Code", dataIndex: "code", key: "code", render: (text) => <a>{text}</a> },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Module", dataIndex: "module", key: "module" },
        { title: "API Path", dataIndex: "apiPath", key: "apiPath" },
        {
            title: "Method",
            dataIndex: "method",
            key: "method",
            render: (method) => {
                const color = methodColors[method] || "black";
                return <span style={{ color, fontWeight: 700 }}>{method}</span>;
            },
        },
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
                    <EditOutlined
                        style={{ cursor: "pointer", color: "#faad14" }}
                        onClick={() => onEdit(record)}
                    />
                </Space>
            ),
        },
    ];

    const onEdit = (record) => {
        setPermissionData(record);
        setIsModalUpdateOpen(true);
    };

    const onChange = (pagination) => {
        if (pagination && pagination.current) {
            const newCurrent = pagination.current - 1; // convert Antd 1-based → API 0-based
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
                dataSource={dataPermission}
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

export default PermissionTable;
