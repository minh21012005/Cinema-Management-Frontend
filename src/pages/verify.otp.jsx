import { useState, useRef } from "react";
import { Button, Form, Input, notification, Typography, Space } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpApi } from "../services/api.service";

const { Title, Text } = Typography;

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return; // chỉ cho phép số
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Tự chuyển sang ô tiếp theo
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOtp = async () => {
        const otpCode = otp.join("");
        if (otpCode.length < 6) {
            notification.warning({
                message: "Thiếu mã OTP",
                description: "Vui lòng nhập đủ 6 chữ số OTP!",
            });
            return;
        }

        try {
            const res = await verifyOtpApi({ email, otp: otpCode });
            if (res?.data) {
                notification.success({
                    message: "Xác minh OTP thành công",
                    description: "Tài khoản của bạn đã được kích hoạt!",
                });
                navigate("/login");
            } else {
                notification.error({
                    message: "Error",
                    description: JSON.stringify(res.message)
                })
            }
        } catch (err) {
            notification.error({
                message: "Lỗi xác minh OTP",
                description: "Sai mã OTP hoặc đã hết hạn!",
            });
        }
    };

    return (
        <div style={{
            maxWidth: 400,
            margin: "80px auto",
            border: "1px solid #ccc",
            padding: 30,
            borderRadius: 8,
            textAlign: "center"
        }}>
            <Title level={3}>Xác minh OTP</Title>
            <Text>Nhập mã OTP được gửi đến email:</Text>
            <br />
            <Text strong>{email}</Text>

            <Space style={{ marginTop: 30, marginBottom: 20 }}>
                {otp.map((digit, index) => (
                    <Input
                        key={index}
                        value={digit}
                        maxLength={1}
                        ref={(el) => (inputRefs.current[index] = el)}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        style={{
                            width: 45,
                            height: 45,
                            textAlign: "center",
                            fontSize: 18,
                            borderRadius: 8,
                        }}
                    />
                ))}
            </Space>

            <Button type="primary" block onClick={handleVerifyOtp}>
                Xác nhận
            </Button>

            <Button type="link" style={{ marginTop: 15 }} onClick={() => navigate("/register")}>
                ← Quay lại đăng ký
            </Button>
        </div>
    );
};

export default VerifyOtpPage;
