import { Button, Col, DatePicker, Divider, Form, Input, notification, Radio, Row } from "antd"
import { Link, useNavigate } from "react-router-dom";
import { registerUserApi } from "../services/api.service";
import dayjs from "dayjs";

const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (value) => {
        const dateFormatted = value.dateOfBirth.format("YYYY-MM-DD");
        const res = await registerUserApi(value.name, value.email, value.password,
            value.phone, value.address, dateFormatted, value.gender);
        if (res.data) {
            notification.success({
                message: "Register user",
                description: "Đăng kí user thành công!"
            })
            navigate("/login");
        } else {
            notification.error({
                message: "Register user error",
                description: JSON.stringify(res.message)
            })
        }
    }

    return (
        <>
            <fieldset style={{
                margin: "30px auto",
                border: "1px solid #ccc",
                borderRadius: "5px",
                width: "700px",
                textAlign: "start"
            }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ margin: "30px" }}
                // onFinishFailed={onFinishFailed}
                >
                    <style>{`
                        .ant-form-item {
                        margin-bottom: 12px;
                        }
                    `}</style>
                    <h2 style={{ textAlign: "center" }}>Đăng ký tài khoản</h2>
                    <Row justify={"center"}>
                        <Col xs={18}>
                            <Form.Item
                                label="Full Name"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify={"center"}>
                        <Col xs={18}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập email!'
                                    },
                                    {
                                        type: "email",
                                        message: 'Email không đúng định dạng!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify={"center"}>
                        <Col xs={18}>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify={"center"}>
                        <Col xs={18}>
                            <Form.Item
                                label="Phone number"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập số điện thoại!"
                                    },
                                    {
                                        pattern: new RegExp(/^0(3|5|7|8|9)[0-9]{8}$/),
                                        message: "Số điện thoại không hợp lệ! Vui lòng nhập số VN."
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify={"center"}>
                        <Col xs={18}>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify="center" gutter={18}>
                        <Col xs={10}>
                            <Form.Item
                                label="Date of Birth"
                                name="dateOfBirth"
                                rules={[{ required: true, message: 'Vui lòng nhập ngày sinh của bạn!' }]}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="DD-MM-YYYY"
                                    disabledDate={(current) => current && current > dayjs()}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={8}>
                            <Form.Item style={{ justifyItems: "center" }}
                                label="Gender"
                                name="gender"
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                            >
                                <Radio.Group>
                                    <Radio value="MALE">Male</Radio>
                                    <Radio value="FEMALE">Female</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row justify={"center"}>
                        <Col md={18}>
                            <Form.Item label={null}>
                                <Button type="primary" htmlType="submit" style={{ margin: "15px 0 0" }}>
                                    Register
                                </Button>
                            </Form.Item>
                            <Divider />
                            <div style={{ textAlign: "center" }}>Đã có tài khoản? <Link to={"/login"}>Đăng nhập tại đây</Link></div>
                        </Col>
                    </Row>
                </Form >
            </fieldset>
        </>
    )
}

export default RegisterPage;