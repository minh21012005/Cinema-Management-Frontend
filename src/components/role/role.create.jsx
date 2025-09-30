import { createRoleAPI } from "@/services/api.service";
import { Modal, Form, Input, Switch, Select, notification } from "antd";
import { useState } from "react";

const { Option } = Select;

const RoleCreateModal = (props) => {
    const { isModalOpen, setIsModalOpen, loadRole, listPermission } = props;

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleOk = async (values) => {
        const res = await createRoleAPI(
            values.name,
            values.code,
            values.description,
            values.active,
            values.permissionIds || [],
        );
        if (res && res.data) {
            notification.success({
                message: "Success",
                description: `Role ${res.data.name} has been created.`
            });
            form.resetFields();
            setIsModalOpen(false);
            loadRole();
        } else {
            notification.error({
                message: "Failed",
                description: JSON.stringify(res.message),
            });
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    return (
        <Modal
            title="Create Role"
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
                    label="Role Name"
                    rules={[
                        { required: true, message: "Role name is required" },
                        { min: 3, max: 50, message: "Role name must be between 3 and 50 characters" },
                    ]}
                >
                    <Input placeholder="Enter role name" />
                </Form.Item>

                <Form.Item
                    name="code"
                    label="Role Code"
                    rules={[
                        { required: true, message: "Role code is required" },
                        { min: 2, max: 20, message: "Role code must be between 2 and 20 characters" },
                    ]}
                >
                    <Input placeholder="Enter role code" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea placeholder="Optional description" />
                </Form.Item>

                <Form.Item name="permissionIds" label="Permissions">
                    <Select
                        mode="multiple"
                        placeholder="Select permissions"
                        allowClear
                        showSearch
                        optionFilterProp="children"
                    >
                        {[...new Set(listPermission.map(p => p.module))].map((module) => (
                            <Select.OptGroup key={module} label={module}>
                                {listPermission
                                    .filter(p => p.module === module)
                                    .map((perm) => (
                                        <Option key={perm.id} value={perm.id}>
                                            {perm.name} ({perm.code})
                                        </Option>
                                    ))}
                            </Select.OptGroup>
                        ))}
                    </Select>
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

export default RoleCreateModal;
