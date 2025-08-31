import { changeSeatStatusAPI, fetchAllSeatTypeAPI } from "@/services/api.service";
import { Form, Input, Modal, notification, Popconfirm, Select, Switch } from "antd";
import { useEffect, useState } from "react";

const SeatModal = (props) => {

    const { isModalOpen, setIsModalOpen, seatSelected, setSeatSelected, fetchSeats } = props;
    const [seatType, setSeatType] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchSeatsType();
    }, []);

    useEffect(() => {
        if (seatSelected) {
            form.setFieldsValue({
                name: seatSelected.name,
                type: seatSelected.seatType.id,
            });
        }
    }, [seatSelected]);

    const handleRefresh = () => {
        setIsModalOpen(false);
        setSeatSelected(null);
        form.resetFields();
    }

    const onFinish = (values) => {
        console.log('Form values:', values);
        handleRefresh();
    };

    const fetchSeatsType = async () => {
        const res = await fetchAllSeatTypeAPI();
        if (res && res.data) {
            setSeatType(res.data);
        }
    }

    const changeSeatStatus = async (id) => {
        const res = await changeSeatStatusAPI(id);
        if (res && res.data) {
            notification.success({
                message: "Success",
                description: "Seat status changed successfully",
            })
            handleRefresh();
            fetchSeats();
        } else {
            notification.error({
                message: "Error",
                description: "Failed to change seat status",
            })
        }
    }


    return (
        <Modal
            title={seatSelected ? `Update Seat ${seatSelected.name}` : "Create Seat"}
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleRefresh}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="Type"
                    name="type"
                    rules={[{ required: true, message: "Vui lòng chọn type!" }]}
                >
                    <Select placeholder="Chọn role" style={{ width: "100%" }}>
                        {seatType && seatType.length > 0 && seatType.map((item) => (
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            <Popconfirm
                title="Bạn có chắc chắn muốn thay đổi trạng thái?"
                okText="Có"
                cancelText="Không"
                onConfirm={() => { changeSeatStatus(seatSelected.id) }}
            >
                <Switch
                    checked={seatSelected?.active}
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
                    onClick={(e) => e.preventDefault()} // chặn đổi trạng thái ngay lập tức
                />
            </Popconfirm>
        </Modal>
    )
}
export default SeatModal;