import { changeCinemaStatusAPI, updateCinemaApi } from "@/services/api.service";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Form, Input, Modal, notification, Popconfirm, Space, Switch, Table } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CinemaTable = (props) => {

    const { dataCinema, loadCinema, current, pageSize, total, setCurrent, setPageSize } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cinemaSelected, setCinemaSelected] = useState(null);

    const [form] = Form.useForm();
    const nav = useNavigate();

    const columns = [
        {
            title: "STT",
            render: (_, record, index) => {
                return (
                    <div>{index + 1 + current * pageSize}</div>
                )
            }
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Link to={`${record.id}/rooms`} style={{ color: "#1677ff" }}>
                    {text}
                </Link>
            ),
        },
        {
            title: "City",
            dataIndex: "city",
            key: "city",
            render: (text) => text,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (text) => text,
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            render: (text) => text,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <EyeOutlined style={{ color: "#1677ff" }}
                        onClick={() => { nav(`/manager/cinemas/${record.id}/showtime`) }}
                    />
                    <EditOutlined
                        onClick={() => {
                            handleUpdate(record.id)
                        }}
                        style={{ cursor: "pointer", color: "orange" }} />
                    <Popconfirm
                        title={`Xác nhận ${record.active ? "vô hiệu hóa" : "kích hoạt"} rạp?`}
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => changeStatus(record.id)}
                    >
                        <Switch
                            checked={record.active}
                            checkedChildren="Enabled"
                            unCheckedChildren="Disabled"
                            onClick={(e) => e.preventDefault()} // chặn đổi trạng thái ngay lập tức
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const changeStatus = async (id) => {
        console.log(id)
        try {
            await changeCinemaStatusAPI(id);
            loadCinema(); // reload user data after changing status
        } catch (error) {
            console.error("Failed to change user status:", error);
        }
    }

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current) {
            const newCurrent = pagination.current - 1; // convert 1-based (Antd) -> 0-based (API)
            if (newCurrent !== current) {
                setCurrent(newCurrent);
            }
        }

        if (pagination && pagination.pageSize) {
            if (pagination.pageSize !== pageSize) {
                setPageSize(pagination.pageSize);
            }
        }
    };

    const handleUpdate = (id) => {
        showModal();
        const cinema = dataCinema.find(item => item.id === id);
        if (cinema) {
            setCinemaSelected(cinema);
            form.setFieldsValue({
                name: cinema.name,
                city: cinema.city,
                address: cinema.address,
                phone: cinema.phone
            });
        }
    }

    const onFinish = async () => {
        if (cinemaSelected) {
            const res = await updateCinemaApi(
                cinemaSelected.id,
                form.getFieldValue("name"),
                form.getFieldValue("city"),
                form.getFieldValue("address"),
                form.getFieldValue("phone")
            );
            if (res.data) {
                notification.success({
                    message: "Update Cinema Success",
                    description: "Cập nhật rạp thành công!"
                });
                handleCancel(); // ✅ reset + đóng modal
                loadCinema(); // ✅ load lại danh sách rạp
            } else {
                notification.error({
                    message: "Update cinema error",
                    description: JSON.stringify(res.message)
                });
            }
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setCinemaSelected(null);
        form.resetFields(); // reset dữ liệu form
        setIsModalOpen(false);
    };

    return (
        <>
            <Table columns={columns}
                dataSource={dataCinema}
                rowKey={"id"}
                pagination={
                    {
                        current: current + 1,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        total: total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }}
                onChange={onChange}
            />
            <Modal
                title="Update Cinema"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên rạp!" }]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="City"
                        name="city"
                        rules={[{ required: true, message: "Vui lòng nhập thành phố!" }]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>


                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Phone number"
                        name="phone"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại!" },
                            {
                                pattern: /^0(3|5|7|8|9)[0-9]{8}$/,
                                message: "Số điện thoại không hợp lệ! Vui lòng nhập số VN."
                            }
                        ]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default CinemaTable;