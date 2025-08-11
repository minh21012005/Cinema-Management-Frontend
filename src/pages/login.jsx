import React, { useContext, useState } from 'react';
import { Button, Checkbox, Col, Divider, Form, Input, message, notification, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';
import { loginApi } from '../services/api.service';
import { AuthContext } from '../components/context/auth.context';

const LoginPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        const res = await loginApi(values.email, values.password);
        if (res.data) {
            message.success("Đăng nhập thành công");
            localStorage.setItem("access_token", res.data.access_token);
            setUser(res.data.user);
            if (res.data.user.role.name === 'ADMIN') {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } else {
            notification.error({
                message: "Error Login",
                description: JSON.stringify(res.message)
            })
        }
        setLoading(false);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Row justify={"center"} style={{ marginTop: "120px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Đăng Nhập</legend>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Email không được để trống!',
                                },
                                {
                                    type: "email",
                                    message: 'Email không đúng định dạng!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Password không được để trống!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item >
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Login
                                </Button>
                                <Link to="/">Go to homepage <ArrowRightOutlined /></Link>
                            </div>
                        </Form.Item>
                    </Form>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row >
    )
}

export default LoginPage;