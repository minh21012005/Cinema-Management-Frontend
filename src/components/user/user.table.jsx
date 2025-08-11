import { Space, Table, Tag } from "antd";

const UserTable = (props) => {

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
                    <a>Invite {record.name}</a>
                    <a>Delete</a>
                </Space>
            ),
        },
    ];

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
    )
}

export default UserTable;