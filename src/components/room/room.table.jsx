import { fetchAllRoomAPI } from "@/services/api.service";
import { Button, Popconfirm, Space, Switch, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RoomTable = () => {

    const [dataRoom, setDataRoom] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        loadRoom();
    }, []);

    const loadRoom = async () => {
        const res = await fetchAllRoomAPI(id);
        if (res.data) {
            setDataRoom(res.data);
        }
    };

    const columns = [
        { title: "STT", render: (_, record, index) => index + 1 },
        { title: "Tên phòng", dataIndex: "name", key: "name" },
        { title: "Loại phòng", dataIndex: "type", key: "type" },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button onClick={() => handleUpdate(record)}>Edit</Button>
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