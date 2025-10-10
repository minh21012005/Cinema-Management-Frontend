import { useContext } from "react";
import { AuthContext } from "../../components/context/auth.context";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";

const PrivateRouteClient = (props) => {

    const { isAppLoading, user } = useContext(AuthContext);

    if (isAppLoading) {
        return (
            <Spin style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }} />
        )
    }

    if (user) {
        return (
            <>
                {props.children}
            </>
        )
    } else {
        return (<Navigate to={"/"} />)

    }

}

export default PrivateRouteClient;