import { createRoomApi, fetchAllRoomTypeAPI } from "@/services/api.service";
import { Form, Input, Modal, notification, Select } from "antd";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RoomModal = (props) => {

    const { isModalOpen, setIsModalOpen, loading, setLoading, loadRoom } = props;
    const [roomType, setRoomType] = useState([]);

    const [form] = Form.useForm();

    const { id } = useParams();

    useEffect(() => {
        loadRoomType();
    }, []);

    const loadRoomType = async () => {
        const res = await fetchAllRoomTypeAPI();
        if (res.data) {
            setRoomType(res.data);
        }
    }

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = async (value) => {
        setLoading(true);
        try {
            const res = await createRoomApi(id, value.name, value.type);
            if (res.data) {
                notification.success({
                    message: "Thành công!",
                    description: "Tạo phòng thành công!"
                });
                form.resetFields();
                setIsModalOpen(false);
                loadRoom();
            } else {
                notification.error({
                    message: "Tạo phòng thất bại!",
                    description: JSON.stringify(res.message)
                });
            }
        } catch (error) {
            console.error("Failed to create room:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Create Room"
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            maskClosable={true}
            okText="CREATE"
            confirmLoading={loading}
            width={700}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
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
    );
}

export default RoomModal;