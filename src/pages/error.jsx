import { Link, useRouteError } from "react-router-dom";
import { Button, Result } from 'antd';


export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    const message =
        error?.statusText ||
        error?.message ||
        "Có lỗi xảy ra, vui lòng thử lại sau!";

    return (
        <Result
            status="404"
            title="Oops!"
            subTitle={message}
            extra={<Button type="primary"><Link to="/">Back Home</Link></Button>}
        />
    );
}
