import { useEffect, useState } from "react";
import {
    Card,
    Divider,
    Input,
    Button,
    Typography,
    Space,
    Modal,
    notification,
    Image,
} from "antd";
import {
    DollarOutlined,
    CreditCardOutlined,
    CheckCircleTwoTone,
    CloseCircleTwoTone,
} from "@ant-design/icons";
import { fetchQrCode } from "@/services/api.service";

const { Text, Title } = Typography;

const CartPayment = ({
    setCartFood,
    setTotal,
    setSelectedSeats,
    stompClient,
    selectedSeats,
    seatLayouts,
    foods,
    combos,
    cartFood,
    totalPrice,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    ticketPrice,
    handleBooking,
}) => {
    const [cashModalVisible, setCashModalVisible] = useState(false);
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [qrData, setQrData] = useState(null); // lưu dữ liệu QR từ backend
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        if (!stompClient || !stompClient.connected || !orderId) return;

        const sub = stompClient.subscribe(`/topic/order-status/${orderId}`, (msg) => {
            const orderData = JSON.parse(msg.body);
            if (orderData.paid) {
                notification.success({
                    message: "Thanh toán thành công",
                    description: `Đơn hàng #${orderData.id} đã được thanh toán!`,
                });
                setQrModalVisible(false); // nếu đang mở modal QR, đóng đi
                setQrData(null);
                setOrderId(null);
                setSelectedSeats([]);
                setCartFood({});
                setTotal(0);
                setCustomerName(null);
                setCustomerPhone(null);
            }
        });
        return () => sub.unsubscribe();

    }, [stompClient, orderId]);


    // Gọi BE và mở modal QR
    const handleSepayPayment = async () => {
        const dataOrder = await handleBooking('SEPAY');
        setOrderId(dataOrder.data.id);
        const res = await fetchQrCode(totalPrice, dataOrder.data.id);
        if (res.data) {
            setQrData(res.data);
            setQrModalVisible(true);
        } else {
            notification.error({
                message: "Failed",
                description: "Không tải được QR Code"
            })
        }
    };

    return (
        <>
            <Card title="Cart & Payment" style={{ borderRadius: 12 }}>
                <Text strong>Tickets:</Text>
                {selectedSeats.length === 0 && <div>No tickets selected</div>}
                {selectedSeats.map((s) => {
                    const seat = seatLayouts.find((seat) => seat.id === s);
                    return (
                        <div key={s}>
                            {seat?.name} ({seat?.seatType?.name}) - {ticketPrice(seat)}k
                        </div>
                    );
                })}

                <Divider />

                <Text strong>Food / Combo:</Text>
                {Object.entries(cartFood)
                    .filter(([_, qty]) => qty > 0)
                    .map(([key, qty]) => {
                        const [type, id] = key.split("-");
                        const item =
                            type === "food"
                                ? foods.find((f) => f.id === Number(id))
                                : combos.find((c) => c.id === Number(id));
                        return (
                            <div key={key}>
                                {item?.name} x {qty} = {item?.price * qty}k
                            </div>
                        );
                    })}

                <Divider />

                <Text strong style={{ fontSize: 16 }}>
                    Total: <span style={{ color: "#fa541c" }}>{totalPrice}k</span>
                </Text>

                <Divider />

                <Input
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ marginBottom: 8, borderRadius: 6 }}
                />
                <Input
                    placeholder="Customer Phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ marginBottom: 16, borderRadius: 6 }}
                />

                {/* Hai nút thanh toán */}
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Button
                        type="primary"
                        block
                        icon={<DollarOutlined />}
                        style={{
                            backgroundColor: "#52c41a",
                            borderColor: "#52c41a",
                            borderRadius: 8,
                            height: 45,
                            fontWeight: 600,
                        }}
                        disabled={totalPrice === 0}
                        onClick={() => setCashModalVisible(true)}
                    >
                        Thanh toán tiền mặt
                    </Button>

                    <Button
                        type="primary"
                        block
                        icon={<CreditCardOutlined />}
                        style={{
                            backgroundColor: "#1677ff",
                            borderColor: "#1677ff",
                            borderRadius: 8,
                            height: 45,
                            fontWeight: 600,
                        }}
                        disabled={totalPrice === 0}
                        onClick={() => handleSepayPayment()}
                    >
                        Thanh toán chuyển khoản
                    </Button>
                </Space>
            </Card>

            {/* Modal xác nhận thanh toán tiền mặt */}
            <Modal
                title={null}
                open={cashModalVisible}
                onCancel={() => setCashModalVisible(false)}
                footer={null}
                centered
            >
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <DollarOutlined style={{ fontSize: 48, color: "#52c41a" }} />
                    <Title level={4} style={{ marginTop: 16 }}>
                        Xác nhận thanh toán tiền mặt
                    </Title>
                    <Text style={{ fontSize: 16 }}>
                        Khách hàng đã thanh toán số tiền:{" "}
                        <span style={{ color: "#fa541c", fontWeight: "bold" }}>
                            {totalPrice}k
                        </span>
                    </Text>

                    <Space style={{ marginTop: 24 }}>
                        <Button
                            type="primary"
                            icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                            style={{
                                borderRadius: 8,
                                height: 40,
                                fontWeight: 600,
                                padding: "0 24px",
                            }}
                            onClick={() => {
                                handleBooking("CASH");
                                setCashModalVisible(false);
                            }}
                        >
                            Xác nhận
                        </Button>
                        <Button
                            danger
                            icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}
                            style={{
                                borderRadius: 8,
                                height: 40,
                                fontWeight: 600,
                                padding: "0 24px",
                            }}
                            onClick={() => setCashModalVisible(false)}
                        >
                            Hủy
                        </Button>
                    </Space>
                </div>
            </Modal>

            {/* Modal hiển thị QR thanh toán SEPAY */}
            <Modal
                title="Quét mã QR để thanh toán"
                open={qrModalVisible}
                onCancel={() => setQrModalVisible(false)}
                footer={null}
                centered
            >
                {qrData ? (
                    <div style={{ textAlign: "center", padding: 16 }}>
                        <Image
                            src={qrData}
                            alt="QR thanh toán SEPAY"
                            width={240}
                            preview={false}
                        />
                        <p>
                            <b>Số tiền:</b>{" "}
                            <span style={{ color: "#fa541c" }}>{totalPrice}₫</span>
                        </p>
                    </div>
                ) : (
                    <p>Đang tải QR...</p>
                )}
            </Modal>
        </>
    );
};

export default CartPayment;
