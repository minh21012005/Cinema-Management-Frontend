import { createSeatAPI } from "@/services/api.service";
import { Modal, Form, Select, Row, Col, InputNumber, notification } from "antd";

const SeatModalCreate = (props) => {
    const { isModalCreateOpen, setIsModalCreateOpen, fetchSeats, seatType, id } = props;
    const [form] = Form.useForm();

    const handleRefresh = () => {
        setIsModalCreateOpen(false);
        form.resetFields();
    }

    const onFinish = async (values) => {
        const res = await createSeatAPI(values.row - 1, values.col - 1, values.type, id);
        if (res && res.data) {
            notification.success({
                message: "Success",
                description: "Seat created successfully",
            })
            fetchSeats();
        } else {
            notification.error({
                message: "Error",
                description: JSON.stringify(res.message) || "Failed to create seat",
            })
        }
        handleRefresh();
    }

    return (
        <>
            <Modal
                title="Create Seat"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalCreateOpen}
                onOk={() => form.submit()}
                onCancel={handleRefresh}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Row"
                                name="row"
                                rules={[{ type: "number", min: 1, max: 15 }]}
                            >
                                <InputNumber min={1} max={15} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Col"
                                name="col"
                                rules={[{ type: "number", min: 1, max: 20 }]}
                            >
                                <InputNumber min={1} max={20} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: "Vui lòng chọn type!" }]}
                    >
                        <Select placeholder="Chọn type" style={{ width: "100%" }}>
                            {seatType && seatType.length > 0 && seatType.map((item) => (
                                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default SeatModalCreate;