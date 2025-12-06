import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { AuthContext } from "../components/context/auth.context";

const SocialLogin = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const accessToken = params.get("access_token");
        const userJson = params.get("user");

        // Nếu BE không trả userJson thì fail luôn
        if (!accessToken || !userJson) {
            message.error("Không thể đăng nhập bằng mạng xã hội!");
            navigate("/login");
            return;
        }

        let user = null;
        try {
            user = JSON.parse(decodeURIComponent(userJson));
        } catch (err) {
            console.error("Lỗi parse user JSON:", err);
            message.error("Lỗi dữ liệu trả về từ server!");
            navigate("/login");
            return;
        }

        // Clear session cũ
        localStorage.removeItem("chatSessionId");

        // Lưu token + userId
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("userId", user.id);

        // Set user vào context
        setUser(user);

        message.success("Đăng nhập thành công!");

        // Điều hướng theo role
        switch (user.role?.name) {
            case "ADMIN":
                navigate("/admin");
                break;
            case "MANAGER":
                navigate("/manager");
                break;
            case "STAFF":
                navigate("/staff");
                break;
            case "SUPPORT":
                navigate("/support");
                break;
            default:
                navigate("/");
        }

    }, []);

    return <>Đang xử lý đăng nhập...</>;
};

export default SocialLogin;