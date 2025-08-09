import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthWrapper = (props) => {
    const [user, setUser] = useState({
        email: "",
        phone: "",
        name: "",
        role: "",
        gender: "",
        address: "",
        dateOfBirth: "",
    })

    const [isAppLoading, setIsAppLoading] = useState(true);

    return (
        <AuthContext.Provider value={{ user, setUser, isAppLoading, setIsAppLoading }}>
            {props.children}
        </AuthContext.Provider>
    )
}
