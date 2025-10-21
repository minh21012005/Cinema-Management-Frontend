import { useContext } from "react";
import { AuthContext } from "../../components/context/auth.context";
import { Link, Navigate } from "react-router-dom";
import { Button, Result, Spin } from "antd";

const PrivateRouteSupport = (props) => {

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

    if (user && user.role.name === 'SUPPORT') {
        return (
            <>
                {props.children}
            </>
        )
    } else {
        // return (<Navigate to={"/login"} />)
        return (
            <Result
                status="403"
                title="Unauthorized!"
                subTitle={"Bạn không có quyền truy cập nguồn tài nguyên này!"}
                extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
            />
        )
    }

}

export default PrivateRouteSupport;