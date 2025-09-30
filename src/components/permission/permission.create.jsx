import { createPermissionAPI } from "@/services/api.service";
import { Modal, Form, Input, Switch, Select, notification } from "antd";
import { useState } from "react";

const { Option } = Select;

const PermissionCreateModal = (props) => {
    const { isModalOpen, setIsModalOpen, loadPermission } = props;

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleOk = async (values) => {
        setLoading(true);
        try {
            const res = await createPermissionAPI(
                values.name,
                values.code,
                values.method,
                values.apiPath,
                values.module,
                values.description,
                values.active
            );

            if (res && res.data) {
                notification.success({
                    message: "Success",
                    description: `Permission ${res.data.name} has been created.`
                });
                form.resetFields();
                setIsModalOpen(false);
                loadPermission();
            } else {
                notification.error({
                    message: "Failed",
                    description: JSON.stringify(res.message),
                });
            }
        } catch (e) {
            notification.error({
                message: "Error",
                description: e.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    return (
        <Modal
            title="Create Permission"
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            confirmLoading={loading}
            okText="Create"
            cancelText="Cancel"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleOk}
                initialValues={{ active: true }}
            >
                <Form.Item
                    name="name"
                    label="Permission Name"
                    rules={[{ required: true, message: "Permission name is required" }]}
                >
                    <Input placeholder="Enter permission name" />
                </Form.Item>

                <Form.Item
                    name="code"
                    label="Permission Code"
                    rules={[{ required: true, message: "Permission code is required" }]}
                >
                    <Input placeholder="MOVIE_CREATE, BOOKING_MANAGE..." />
                </Form.Item>

                <Form.Item
                    name="method"
                    label="HTTP Method"
                    rules={[{ required: true, message: "HTTP method is required" }]}
                >
                    <Select placeholder="Select HTTP method">
                        <Option value="GET">GET</Option>
                        <Option value="POST">POST</Option>
                        <Option value="PUT">PUT</Option>
                        <Option value="DELETE">DELETE</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="apiPath"
                    label="API Path"
                    rules={[{ required: true, message: "API path is required" }]}
                >
                    <Input placeholder="/api/v1/movies" />
                </Form.Item>

                <Form.Item
                    name="module"
                    label="Module"
                    rules={[{ required: true, message: "Module is required" }]}
                >
                    <Input placeholder="MOVIE, BOOKING, USER..." />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea placeholder="Optional description" />
                </Form.Item>

                <Form.Item
                    name="active"
                    label="Active"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PermissionCreateModal;
