import { createRoomApi } from "@/services/api.service";
import { Form, Input, InputNumber, Modal, notification, Select } from "antd";
import { useParams } from "react-router-dom";

const RoomModal = (props) => {

    const { isModalOpen, setIsModalOpen, loading, setLoading, loadRoom, roomType } = props;

    const [form] = Form.useForm();

    const { id } = useParams();

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = async (value) => {
        setLoading(true);
        try {
            const res = await createRoomApi(id, value.name, value.type, value.rows, value.cols);
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
                    label="Rows"
                    name="rows"
                    rules={[
                        { required: true, message: "Vui lòng nhập số hàng!" },
                        {
                            type: "number",
                            min: 1,
                            max: 25,
                            message: "Số hàng phải lớn hơn 0 và nhỏ hơn hoặc bằng 25!",
                        },
                    ]}
                >
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Cols"
                    name="cols"
                    rules={[
                        { required: true, message: "Vui lòng nhập số cột!" },
                        {
                            type: "number",
                            min: 1,
                            max: 25,
                            message: "Số cột phải lớn hơn 0 và nhỏ hơn hoặc bằng 25!",
                        },
                    ]}
                >
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: "Vui lòng chọn type!" }]}
                >
                    <Select placeholder="Chọn type" style={{ width: "100%" }}>
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