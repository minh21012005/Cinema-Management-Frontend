import { changeSeatStatusAPI, changeSeatTypeAPI } from "@/services/api.service";
import { Form, Input, Modal, notification, Popconfirm, Select, Switch } from "antd";
import { useEffect, useState } from "react";

const SeatModalUpdate = (props) => {

    const { isModalOpen, setIsModalOpen, seatSelected, setSeatSelected, fetchSeats, seatType } = props;

    const [form] = Form.useForm();

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

    const onFinish = async (values) => {
        const res = await changeSeatTypeAPI(seatSelected.id, values.type);
        if (res && res.data) {
            notification.success({
                message: "Success",
                description: "Seat updated successfully",
            })
            fetchSeats();
        } else {
            notification.error({
                message: "Error",
                description: JSON.stringify(res.message) || "Failed to update seat",
            })
        }
        handleRefresh();
    };



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
            title={seatSelected ? `Update Seat ${seatSelected.name}` : "Loading..."}
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
                    <Select placeholder="Chọn type" style={{ width: "100%" }}>
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
export default SeatModalUpdate;