import { changeRoomStatusAPI, updateRoomApi } from "@/services/api.service";
import { EditOutlined } from "@ant-design/icons";
import { Modal, Popconfirm, Space, Switch, Table, Form, Input, Select, notification } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const RoomTable = (props) => {

    const { dataRoom, loadRoom, roomType } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roomIdSelected, setRoomIdSelected] = useState(null);

    const [form] = Form.useForm();

    const columns = [
        { title: "STT", render: (_, record, index) => index + 1 },
        {
            title: "Tên phòng", dataIndex: "name", key: "name",
            render: (text, record) => (
                <Link to={`/manager/cinemas/rooms/${record.id}/seats`} style={{ color: "#1677ff" }}>
                    {text}
                </Link>
            ),
        },
        { title: "Loại phòng", dataIndex: "type", key: "type", render: (type) => type?.name || "" },
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

    const handleUpdate = (id) => {
        setIsModalOpen(true);
        const room = dataRoom.find(r => r.id === id);
        setRoomIdSelected(id);
        form.setFieldsValue({
            name: room.name,
            type: room.type?.id || null
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setRoomIdSelected(null);
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        const res = await updateRoomApi(roomIdSelected, values.name, values.type);
        if (res.data) {
            setRoomIdSelected(null);
            notification.success({
                message: "Cập nhật phòng thành công",
                description: `Phòng ${values.name} đã được cập nhật thành công.`,
            });
            loadRoom();
            setIsModalOpen(false);
            form.resetFields();
        } else {
            notification.error({
                message: "Cập nhật phòng thất bại",
                description: `Không thể cập nhật phòng ${values.name}. Vui lòng thử lại.`,
            });
        }
    };

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
            <Modal
                title="Update Room"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên rạp!" }]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: "Vui lòng chọn type!" }]}
                    >
                        <Select placeholder="Chọn role" style={{ width: "100%" }}>
                            {roomType && roomType.length > 0 && roomType.map((item) => (
                                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default RoomTable;