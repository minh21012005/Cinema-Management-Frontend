import Sidebar from "../../components/layout/admin/sidebar";
import UserTable from "../../components/user/user.table";
import HeaderLayout from "../../components/layout/admin/header";
import { useEffect, useState } from "react";
import { createUserApi, fetchAllUserAPI } from "@/services/api.service";
import { Button, Input, Modal, Form, Row, Col, Select, DatePicker, notification } from "antd";
import dayjs from "dayjs";


const AdminPage = () => {
    const [dataUser, setDataUser] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const [form] = Form.useForm();

    useEffect(() => { loadUser(); }, [current, pageSize]);

    const loadUser = async () => {
        const res = await fetchAllUserAPI(current, pageSize);
        if (res.data) {
            setDataUser(res.data.result);
            setCurrent(res.data.meta.page);
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.total);
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const onFinish = async (value) => {
        setLoading(true);
        try {
            const dateFormatted = value.dateOfBirth.format("YYYY-MM-DD");
            const res = await createUserApi(
                value.name,
                value.email,
                value.password,
                value.phone,
                value.address,
                dateFormatted,
                value.gender,
                value.roleId
            );
            if (res.data) {
                notification.success({
                    message: "Register user",
                    description: "Tạo user thành công!"
                });
                handleCancel(); // ✅ reset + đóng modal
                loadUser();
            } else {
                notification.error({
                    message: "Register user error",
                    description: JSON.stringify(res.message)
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields(); // reset dữ liệu form
        setIsModalOpen(false); // đóng modal
    };

    return (
        <>
            <HeaderLayout />
            <div style={{ display: 'flex', height: '100vh' }}>
                <div style={{ width: '250px', borderRight: '1px solid #ddd' }}>
                    <Sidebar />
                </div>
                <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>

                    {/* Thanh chứa nút Create User */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                        <Button type="primary" onClick={showModal}>
                            Create User
                        </Button>
                    </div>

                    <UserTable
                        loadUser={loadUser}
                        dataUser={dataUser}
                        current={current}
                        pageSize={pageSize}
                        total={total}
                        setCurrent={setCurrent}
                        setPageSize={setPageSize}
                    />
                    <Modal
                        title="Create User"
                        open={isModalOpen}
                        onOk={() => form.submit()}
                        onCancel={handleCancel}
                        maskClosable={true}
                        okText="CREATE"
                        confirmLoading={loading}
                        width={700}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        rules={[
                                            { required: true, message: "Vui lòng nhập email!" },
                                            { type: "email", message: "Email không đúng định dạng!" }
                                        ]}
                                    >
                                        <Input style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[
                                            { required: true, message: "Vui lòng nhập mật khẩu!" },
                                            { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" }
                                        ]}
                                    >
                                        <Input.Password style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                                    >
                                        <Input style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Phone number"
                                        name="phone"
                                        rules={[
                                            { required: true, message: "Vui lòng nhập số điện thoại!" },
                                            {
                                                pattern: /^0(3|5|7|8|9)[0-9]{8}$/,
                                                message: "Số điện thoại không hợp lệ! Vui lòng nhập số VN."
                                            }
                                        ]}
                                    >
                                        <Input style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                            >
                                <Input style={{ width: "100%" }} />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
                                    >
                                        <DatePicker
                                            style={{ width: "100%" }}
                                            format="DD-MM-YYYY"
                                            disabledDate={(current) => current && current > dayjs()}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Gender"
                                        name="gender"
                                        rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                                    >
                                        <Select placeholder="Chọn giới tính" style={{ width: "100%" }}>
                                            <Select.Option value="MALE">Male</Select.Option>
                                            <Select.Option value="FEMALE">Female</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Role"
                                name="roleId"
                                rules={[{ required: true, message: "Vui lòng chọn role!" }]}
                            >
                                <Select placeholder="Chọn role" style={{ width: "100%" }}>
                                    <Select.Option value="1">Admin</Select.Option>
                                    <Select.Option value="2">Manager</Select.Option>
                                    <Select.Option value="3">Staff</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>

                </div>
            </div>
        </>
    );
};

export default AdminPage;
