import { changeRoomStatusAPI } from "@/services/api.service";
import { EditOutlined } from "@ant-design/icons";
import { Popconfirm, Space, Switch, Table } from "antd";

const RoomTable = (props) => {

    const { dataRoom, loadRoom } = props;

    const columns = [
        { title: "STT", render: (_, record, index) => index + 1 },
        { title: "Tên phòng", dataIndex: "name", key: "name" },
        { title: "Loại phòng", dataIndex: "type", key: "type" },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <EditOutlined
                        onClick={() => {
                            handleUpdate(record.id)
                        }}
                        style={{ cursor: "pointer", color: "orange" }} />
                    <Popconfirm
                        title={`Xác nhận ${record.active ? "vô hiệu hóa" : "kích hoạt"} phòng?`}
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
            )
        }
    ];

    const changeStatus = async (id) => {
        try {
            await changeRoomStatusAPI(id);
            loadRoom();
        } catch (error) {
            console.error("Failed to change room status:", error);
        }
    };

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
                dataSource={dataRoom}
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

export default RoomTable;