import { createContext, useState, useEffect } from 'react';
import { getAccountApi } from '../../services/api.service';

export const AuthContext = createContext(null);

export const AuthWrapper = (props) => {
    const [user, setUser] = useState(null);
    const [isAppLoading, setIsAppLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("access_token");
            if (!token || location.pathname === "/login" || location.pathname === "/register") {
                setIsAppLoading(false);
                return;
            }

            try {
                const res = await getAccountApi();
                if (res.data) {
                    setUser(res.data.user);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin user:", error);
            }
            setIsAppLoading(false);
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isAppLoading, setIsAppLoading }}>
            {props.children}
        </AuthContext.Provider>
    );
};
