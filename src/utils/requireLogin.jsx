import { useContext } from "react";
import { AuthContext } from "@/components/context/auth.context";
import { message } from "antd";

export const useRequireLogin = () => {
    const { user } = useContext(AuthContext);

    const checkLogin = (onSuccess) => {
        if (!user) {
            message.warning("Vui lòng đăng nhập để tiếp tục!", 3);
            return false;
        }
        onSuccess?.();
        return true;
    };

    return checkLogin;
};
