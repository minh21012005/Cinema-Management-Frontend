import { changeCinemaStatusAPI } from "@/services/api.service";
import { EyeOutlined } from "@ant-design/icons";
import { Popconfirm, Space, Switch, Table } from "antd";

const CinemaTable = (props) => {

    const { dataCinema, loadCinema, current, pageSize, total, setCurrent, setPageSize } = props;

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
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "City",
            dataIndex: "city",
            key: "city",
            render: (text) => text,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (text) => text,
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            render: (text) => text,
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
                        title={`Xác nhận ${record.active ? "vô hiệu hóa" : "kích hoạt"} rạp?`}
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => changeStatus(record.id)}
                    >
                        <Switch
                            checked={record.active}
                            checkedChildren="Enabled"
                            unCheckedChildren="Disabled"
                            onClick={(e) => e.preventDefault()} // chặn đổi trạng thái ngay lập tức
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const changeStatus = async (id) => {
        try {
            await changeCinemaStatusAPI(id);
            loadCinema(); // reload user data after changing status
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
                dataSource={dataCinema}
                rowKey={"id"}
                pagination={
                    {
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }}
                onChange={onChange}
            />
        </>
    );
}

export default CinemaTable;