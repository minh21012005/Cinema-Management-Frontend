import { useEffect } from "react";
import { Modal, Form, Input, Switch, Select, notification } from "antd";
import { updatePermissionAPI } from "@/services/api.service";

const { Option } = Select;

const PermissionUpdateModal = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, loadPermission, permissionData, setPermissionData } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (permissionData) {
            form.setFieldsValue({
                code: permissionData.code,
                name: permissionData.name,
                method: permissionData.method,
                apiPath: permissionData.apiPath,
                module: permissionData.module,
                description: permissionData.description,
                active: permissionData.active,
            });
        }
    }, [permissionData, form]);

    const handleSubmit = async (values) => {
        const res = await updatePermissionAPI(permissionData.id, values);
        if (res && res.data) {
            notification.success({
                message: "Success",
                description: "Cập nhật permission thành công!",
            });
            loadPermission();
            handleCancel();
        } else {
            notification.error({
                message: "Failed",
                description: JSON.stringify(res.message),
            });
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setPermissionData(null);
        setIsModalUpdateOpen(false);
    };

    return (
        <Modal
            open={isModalUpdateOpen}
            title="Update Permission"
            onCancel={handleCancel}
            onOk={() => form.submit()}
            width={600}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="code" label="Mã Permission" rules={[{ required: true, message: "Vui lòng nhập mã permission" }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item name="name" label="Tên Permission" rules={[{ required: true, message: "Vui lòng nhập tên permission" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="method" label="Method" rules={[{ required: true, message: "Vui lòng chọn method" }]}>
                    <Select>
                        <Option value="GET">GET</Option>
                        <Option value="POST">POST</Option>
                        <Option value="PUT">PUT</Option>
                        <Option value="DELETE">DELETE</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="apiPath" label="API Path" rules={[{ required: true, message: "Vui lòng nhập API Path" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="module" label="Module" rules={[{ required: true, message: "Vui lòng nhập module" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Mô tả">
                    <Input.TextArea rows={2} />
                </Form.Item>
                <Form.Item name="active" label="Trạng thái" valuePropName="checked">
                    <Switch checkedChildren="ACTIVE" unCheckedChildren="INACTIVE" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PermissionUpdateModal;
