// RoomForm.jsx
import React from "react";
import { Form, Input, Select, Divider, Button, InputNumber, Row, Col } from "antd";

const RoomForm = ({ form, roomTypes, seatTypes, onSave, onClear }) => {
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onSave}
            initialValues={{
                rows: 6,
                cols: 10,
                seatType: Object.keys(seatTypes)[0],
            }}
        >
            <Form.Item
                label="Tên phòng"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên phòng" }]}
            >
                <Input placeholder="Nhập tên phòng..." />
            </Form.Item>

            <Form.Item
                label="Loại phòng"
                name="roomType"
                rules={[{ required: true, message: "Vui lòng chọn loại phòng" }]}
            >
                <Select placeholder="Chọn loại phòng">
                    {roomTypes.map((rt) => (
                        <Select.Option key={rt.id} value={rt.id}>
                            {rt.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Số hàng"
                        name="rows"
                        rules={[{ type: "number", min: 1, max: 15 }]}
                    >
                        <InputNumber min={1} max={15} style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Số cột"
                        name="cols"
                        rules={[{ type: "number", min: 1, max: 20 }]}
                    >
                        <InputNumber min={1} max={20} style={{ width: "100%" }} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Loại ghế hiện tại" name="seatType">
                <Select>
                    {Object.values(seatTypes).map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                            {item.label}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Divider />

            <Button block onClick={onClear}>
                Clear
            </Button>
            <Button htmlType="submit" type="primary" block style={{ marginTop: 8 }}>
                Save Room
            </Button>
        </Form>
    );
};

export default RoomForm;
