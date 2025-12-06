import UserTable from "../../components/user/user.table";
import { useEffect, useState } from "react";
import { createUserApi, fetchActiveCinemasAPI, fetchAllRoleAPI, fetchAllUserAPI } from "@/services/api.service";
import { Button, Input, Modal, Form, Row, Col, Select, DatePicker, notification, Space } from "antd";
import dayjs from "dayjs";
const { Search } = Input;

const UserPage = () => {
    const [dataUser, setDataUser] = useState([]);
    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailSearch, setEmailSearch] = useState(null);
    const [roleList, setRoleList] = useState([]);
    const [roleSelected, setRoleSelected] = useState(null);
    const [cinemaData, setCinemaData] = useState([])
    const [selectedRoleCode, setSelectedRoleCode] = useState(null);

    const [form] = Form.useForm();

    useEffect(() => { loadUser(); }, [current, pageSize, emailSearch, roleSelected]);
    useEffect(() => { loadRole(); loadCinema(); }, []);

    const loadUser = async () => {
        const res = await fetchAllUserAPI(current, pageSize, emailSearch, roleSelected);
        if (res.data) {
            setDataUser(res.data.result);
            setCurrent(res.data.meta.page);
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.total);
        }
    };

    const loadCinema = async () => {
        const res = await fetchActiveCinemasAPI();
        if (res?.data) {
            setCinemaData(res.data);
        }
    }

    const loadRole = async () => {
        const res = await fetchAllRoleAPI();
        if (res.data) {
            setRoleList(res.data);
        }
    }

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
                value.roleId,
                value.cinemaId
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
        setSelectedRoleCode(null);
        setIsModalOpen(false); // đóng modal
    };

    const onSearch = (value, _e, info) => {
        if (value) {
            let trimmedValue = value.trim();
            setEmailSearch(trimmedValue);
            setCurrent(); // reset về trang đầu tiên khi tìm kiếm
        } else {
            setEmailSearch(null); // nếu không có giá trị tìm kiếm thì reset
            setCurrent(0); // reset về trang đầu tiên
        }
    }

    const handleChange = value => {
        if (value) {
            setRoleSelected(value);
        } else {
            setRoleSelected(null); // nếu không có giá trị thì reset
        }
    };

    return (
        <>
            {/* Thanh chứa nút Create User */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '330px' }}>
                    <Space direction="vertical">
                        <Search
                            placeholder="Nhập email..."
                            allowClear
                            onSearch={onSearch}
                            style={{ width: 200 }}
                        />
                    </Space>
                    <Space wrap>
                        <Select
                            placeholder="Select role"
                            allowClear
                            onChange={handleChange}
                            style={{ width: 120 }}
                            options={roleList.map(role => ({
                                label: role.name,
                                value: role.id
                            }))}
                        />
                    </Space>
                </div>

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
                        <Select
                            placeholder="Chọn role"
                            style={{ width: "100%" }}
                            onChange={(value) => {
                                const role = roleList.find(r => r.id === value);
                                setSelectedRoleCode(role?.code || null);
                            }}
                        >
                            {roleList.map((role) => (
                                <Select.Option key={role.id} value={role.id}>
                                    {role.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {selectedRoleCode === "STAFF" && (
                        <Form.Item
                            label="Cinema"
                            name="cinemaId"
                            rules={[{ required: true, message: "Vui lòng chọn rạp cho nhân viên!" }]}
                        >
                            <Select placeholder="Chọn rạp" style={{ width: "100%" }}>
                                {cinemaData.map((cinema) => (
                                    <Select.Option key={cinema.id} value={cinema.id}>
                                        {cinema.name} - {cinema.city}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </>
    );
};

export default UserPage;
