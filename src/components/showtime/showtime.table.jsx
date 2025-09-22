import { changeShowtimeStatusAPI } from "@/services/api.service";
import { EditOutlined } from "@ant-design/icons";
import { notification, Popconfirm, Space, Switch, Table } from "antd";
import dayjs from "dayjs";

const ShowTimeTable = (props) => {
    const { dataShowtime, setDataShowtime, current, pageSize, total, setCurrent, setPageSize, fetchShowtimeByCinema } = props;

    const columns = [
        {
            title: "STT",
            render: (_, __, index) => index + 1
        },
        {
            title: "Phòng",
            dataIndex: "roomName",
            key: "roomName",
        },
        {
            title: "Phim",
            dataIndex: "movieTitle",
            key: "movieId"
        },
        {
            title: "Bắt đầu",
            dataIndex: "startTime",
            key: "startTime",
            render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm")
        },
        {
            title: "Kết thúc",
            dataIndex: "endTime",
            key: "endTime",
            render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm")
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <EditOutlined
                        onClick={() => handleUpdate(record.id)}
                        style={{ cursor: "pointer", color: "orange" }}
                    />
                    <Popconfirm
                        title={`Xác nhận ${record.active ? "vô hiệu hóa" : "kích hoạt"} suất chiếu?`}
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => changeStatus(record.id)}
                    >
                        <Switch
                            checked={record.active}
                            checkedChildren="Enabled"
                            unCheckedChildren="Disabled"
                        />
                    </Popconfirm>
                </Space>
            )
        }
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

    const changeStatus = async (id) => {
        console.log(id)
        try {
            const res = await changeShowtimeStatusAPI(id);
            if (res.data) {
                fetchShowtimeByCinema();
            } else {
                notification.error({
                    message: "Error",
                    description: JSON.stringify(res.message) || "Failed to update showtime",
                })
            }
        } catch (error) {
            console.error("Failed to change showtime status:", error);
        }
    }

    return (
        <Table
            columns={columns}
            dataSource={dataShowtime || []}
            rowKey="id"
            pagination={
                {
                    current: current + 1,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    total: total,
                    showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                }}
            onChange={onChange}
        />
    );
};

export default ShowTimeTable;
