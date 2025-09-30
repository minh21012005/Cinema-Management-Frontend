import { useState, useEffect } from "react";
import { Modal, Form, Input, Switch, Collapse, List, Typography, Checkbox, notification } from "antd";
import { updateRoleAPI } from "@/services/api.service";

const { Panel } = Collapse;
const { Text } = Typography;

const RoleUpdateModal = (props) => {

    const { listPermission, setIsModalUpdateOpen, isModalUpdateOpen, loadRole, roleData, setRoleData } = props;

    const [form] = Form.useForm();
    const [modulePermissions, setModulePermissions] = useState({});

    // Gom nhóm permission theo module + set active theo roleData
    useEffect(() => {
        if (listPermission) {
            const grouped = listPermission.reduce((acc, p) => {
                if (!acc[p.module]) acc[p.module] = [];
                // nếu roleData.permissions có chứa code này => bật, ngược lại tắt
                const hasPerm = roleData?.permissions?.includes(p.code);
                acc[p.module].push({ ...p, active: hasPerm });
                return acc;
            }, {});
            setModulePermissions(grouped);
        }
    }, [listPermission, roleData]);

    // Khi load dữ liệu role lên form
    useEffect(() => {
        if (roleData) {
            form.setFieldsValue({
                code: roleData.code,
                name: roleData.name,
                description: roleData.description,
                active: roleData.active
            });
        }
    }, [roleData, form]);

    // Toggle cho module (bật/tắt tất cả permission trong module đó)
    const handleToggleModule = (module, checked) => {
        setModulePermissions((prev) => ({
            ...prev,
            [module]: prev[module].map((p) => ({ ...p, active: checked }))
        }));
    };

    // Toggle cho từng permission
    const handleTogglePermission = (module, permId, checked) => {
        setModulePermissions((prev) => ({
            ...prev,
            [module]: prev[module].map((p) =>
                p.id === permId ? { ...p, active: checked } : p
            )
        }));
    };

    const handleSubmit = async (values) => {
        // Lấy ra tất cả permission đang active
        const selectedPermissions = Object.values(modulePermissions)
            .flat()
            .filter((p) => p.active)
            .map((p) => p.id); // lấy id (nếu backend cần id), hoặc p.code

        const payload = {
            ...values,
            permissionIds: selectedPermissions,
        };
        const res = await updateRoleAPI(roleData.id, payload);
        if (res && res.data) {
            notification.success({
                message: "Success",
                description: "Cập nhật role thành công!",
            });
            loadRole();
            handleCancel();
        } else {
            notification.error({
                message: "Failed",
                description: JSON.stringify(res.message)
            });
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setRoleData(null);
        setIsModalUpdateOpen(false);
    };

    return (
        <Modal
            open={isModalUpdateOpen}
            title="Update Role"
            onCancel={handleCancel}
            onOk={() => form.submit()}
            width={700}
        >
            <Form form={form} layout="vertical" initialValues={{ status: true }} onFinish={handleSubmit}>
                <Form.Item
                    name="code"
                    label="Mã Role"
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Tên Role"
                    rules={[{ required: true, message: "Vui lòng nhập tên role" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Mô tả"
                >
                    <Input.TextArea rows={2} />
                </Form.Item>
                <Form.Item name="active" label="Trạng thái" valuePropName="checked">
                    <Switch checkedChildren="ACTIVE" unCheckedChildren="INACTIVE" />
                </Form.Item>
            </Form>

            <h3>Quyền hạn</h3>
            <Collapse>
                {Object.keys(modulePermissions).map((module) => {
                    const allActive = modulePermissions[module].every((p) => p.active);
                    return (
                        <Panel
                            header={
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span>{module}</span>
                                    <div style={{ marginLeft: "auto" }}>
                                        <Checkbox
                                            indeterminate={
                                                modulePermissions[module].some((p) => p.active) &&
                                                !modulePermissions[module].every((p) => p.active)
                                            }
                                            checked={modulePermissions[module].every((p) => p.active)}
                                            onChange={(e) => handleToggleModule(module, e.target.checked)}
                                        >
                                        </Checkbox>
                                    </div>
                                </div>
                            }
                            key={module}
                        >
                            <List
                                dataSource={modulePermissions[module]}
                                renderItem={(perm) => (
                                    <List.Item
                                        actions={[
                                            <Switch
                                                key={perm.id}
                                                checked={perm.active}
                                                onChange={(checked) =>
                                                    handleTogglePermission(module, perm.id, checked)
                                                }
                                            />
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={<Text strong>{perm.name}</Text>}
                                            description={perm.code}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    );
                })}
            </Collapse>
        </Modal>
    );
};

export default RoleUpdateModal;
