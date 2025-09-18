import { Drawer } from "antd";

const ModalUser = (props) => {

    const { isModalDetailOpen, setIsModalDetailOpen, dataUserDetail, setDataUserDetail } = props;

    const onClose = () => {
        setDataUserDetail(null);
        setIsModalDetailOpen(false);
    };

    return (
        <Drawer
            width={"25vw"}
            title="User Detail"
            closable={{ 'aria-label': 'Close Button' }}
            onClose={onClose}
            open={isModalDetailOpen}
        >
            {dataUserDetail ? <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <p>ID: {dataUserDetail.id}</p>
                <p>Name: {dataUserDetail.name}</p>
                <p>Email: {dataUserDetail.email}</p>
                <p>Role ID: {dataUserDetail.roleId}</p>
                <p>Phone: {dataUserDetail.phone}</p>
                <p>Address: {dataUserDetail.address}</p>
                <p>
                    Date of birth: {dataUserDetail.dateOfBirth
                        ? dataUserDetail.dateOfBirth.split("-").reverse().join("/")
                        : ""}
                </p>
            </div>
                :
                <div></div>
            }
        </Drawer>
    );
}

export default ModalUser;