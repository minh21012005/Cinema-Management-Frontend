// src/pages/manager/cinema/CinemaListPage.jsx
import { useEffect, useState } from "react";
import CinemaTable from "@/components/cinema/cinema.table";
import { createCinemaApi, fetchCinemaAPI } from "@/services/api.service";
import { Button, Space, Input, Modal, Form, notification } from "antd";

const { Search } = Input;

const CinemaListPage = () => {
    const [dataCinema, setDataCinema] = useState([]);
    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nameSearch, setNameSearch] = useState(null);

    const [form] = Form.useForm();

    useEffect(() => {
        loadCinema();
    }, [current, pageSize, nameSearch]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const loadCinema = async () => {
        const res = await fetchCinemaAPI(current, pageSize, nameSearch);
        if (res.data) {
            setDataCinema(res.data.result);
            setCurrent(res.data.meta.page);
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.total);
        }
    };

    const onSearch = (value) => {
        if (value) {
            let trimmedValue = value.trim();
            setNameSearch(trimmedValue);
            setCurrent(0);
        } else {
            setNameSearch(null);
            setCurrent(0);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = async (value) => {
        setLoading(true);
        try {
            const res = await createCinemaApi(
                value.name,
                value.city,
                value.address,
                value.phone
            );
            if (res.data) {
                notification.success({
                    message: "Create Cinema Success",
                    description: "Tạo rạp thành công!",
                });
                handleCancel();
                loadCinema();
            } else {
                notification.error({
                    message: "Create cinema error",
                    description: JSON.stringify(res.message),
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", width: "350px" }}>
                    <Space direction="vertical">
                        <Search
                            placeholder="Nhập tên rạp..."
                            allowClear
                            onSearch={onSearch}
                            style={{ width: 200 }}
                        />
                    </Space>
                </div>

                <Button type="primary" onClick={showModal}>
                    Create Cinema
                </Button>
            </div>

            <CinemaTable
                loadCinema={loadCinema}
                dataCinema={dataCinema}
                current={current}
                pageSize={pageSize}
                total={total}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
            />

            <Modal
                title="Create Cinema"
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                maskClosable={true}
                okText="CREATE"
                confirmLoading={loading}
                width={700}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
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
                                message: "Số điện thoại không hợp lệ! Vui lòng nhập số VN.",
                            },
                        ]}
                    >
                        <Input style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CinemaListPage;
