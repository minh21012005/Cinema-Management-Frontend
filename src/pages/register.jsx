import { Button, Col, DatePicker, Divider, Form, Input, notification, Radio, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { registerRequestApi } from "../services/api.service";

const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (value) => {
        try {
            const dateFormatted = value.dateOfBirth.format("YYYY-MM-DD");
            const payload = { ...value, dateOfBirth: dateFormatted };

            const res = await registerRequestApi(payload);
            if (res.data) {
                notification.success({
                    message: "Gửi OTP thành công",
                    description: "Vui lòng kiểm tra email để lấy mã OTP!",
                });
                navigate("/verify-otp", { state: { email: value.email } });
            } else {
                notification.error({
                    message: "Đăng ký thất bại",
                    description: JSON.stringify(res.message),
                });
            }
        } catch (err) {
            notification.error({
                message: "Đăng ký thất bại",
                description: "Lỗi không xác định",
            });
        }
    };

    return (
        <fieldset
            style={{
                margin: "50px auto",
                border: "1px solid #ccc",
                borderRadius: "5px",
                width: "700px",
                textAlign: "start",
                background: "#fff"
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{
                    margin: "10px",
                    overflowY: "auto",
                    paddingRight: "10px"
                }}
            >
                <h2 style={{ textAlign: "center" }}>Đăng ký tài khoản</h2>

                {/* Họ tên + Email */}
                <Row justify="center" gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label="Họ tên" name="name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true },
                                { type: "email", message: "Email không hợp lệ!" }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Mật khẩu + Số điện thoại */}
                <Row justify="center" gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                { required: true },
                                { min: 8, message: "Tối thiểu 8 ký tự" }
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                { required: true },
                                { pattern: /^0(3|5|7|8|9)[0-9]{8}$/, message: "Số điện thoại không hợp lệ" }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Địa chỉ */}
                <Row justify="center">
                    <Col xs={24}>
                        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Ngày sinh + Giới tính */}
                <Row justify="center" gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Ngày sinh"
                            name="dateOfBirth"
                            rules={[{ required: true }]}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                format="DD-MM-YYYY"
                                disabledDate={(current) => current && current > dayjs()}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label="Giới tính" name="gender" rules={[{ required: true }]}>
                            <Radio.Group>
                                <Radio value="MALE">Nam</Radio>
                                <Radio value="FEMALE">Nữ</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Nút submit */}
                <Row justify="center">
                    <Col xs={24}>
                        <Button type="primary" htmlType="submit" block>
                            Gửi OTP
                        </Button>
                        <Divider />
                        <div style={{ textAlign: "center" }}>
                            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                        </div>
                    </Col>
                </Row>
            </Form>
        </fieldset>
    );
};

export default RegisterPage;