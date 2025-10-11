import { bookingAPI, fetchQrCode } from "@/services/api.service";
import { Modal, Image } from "antd";
import { useState } from "react";

const SeatSummary = ({ selectedSeats, setSelectedSeats, total, showtime, movie, message, cartFood, foods, combos }) => {
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const [qrData, setQrData] = useState(null); // lưu dữ liệu QR từ backend
    const [orderId, setOrderId] = useState(null);

    const selectedItems = Object.entries(cartFood)
        .filter(([_, qty]) => qty > 0)
        .map(([key, qty]) => {
            const [type, id] = key.split("-");
            const list = type === "food" ? foods : combos;
            const item = list.find((i) => i.id === Number(id));
            return { ...item, type, qty };
        });

    const ticketPrice = (seat) => seat?.seatType?.basePrice || 0;

    const seatTotal = selectedSeats.reduce((sum, seat) => sum + ticketPrice(seat), 0);
    const foodTotal = selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const grandTotal = seatTotal + foodTotal;

    const buildBookingData = (method) => {
        return {
            showtimeId: showtime.id,
            seats: selectedSeats.map((seat) => {
                return { seatId: seat.id, price: ticketPrice(seat) };
            }),
            foods: Object.entries(cartFood)
                .filter(([k, q]) => k.startsWith("food") && q > 0)
                .map(([k, q]) => {
                    const id = k.split("-")[1];
                    const item = foods.find((f) => String(f.id) === id);
                    return { foodId: item.id, quantity: q, price: item.price };
                }),
            combos: Object.entries(cartFood)
                .filter(([k, q]) => k.startsWith("combo") && q > 0)
                .map(([k, q]) => {
                    const id = k.split("-")[1];
                    const item = combos.find((c) => String(c.id) === id);
                    return { comboId: item.id, quantity: q, price: item.price };
                }),
            paymentMethod: method
        };
    };

    const handleBooking = async (method) => {
        const bookingData = buildBookingData(method);
        const res = await bookingAPI(bookingData);
        return res;
    };

    // Gọi BE và mở modal QR
    const handleSepayPayment = async () => {
        const dataOrder = await handleBooking('SEPAY');
        setOrderId(dataOrder.data.id);
        const res = await fetchQrCode(grandTotal, dataOrder.data.id);
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

    const handleCancel = () => {
        setSelectedSeats([]);
        setQrModalVisible(false);
    }

    return (
        <div className="seat-summary">
            {/* Ghế đã chọn */}
            <div className="seat-summary__info">
                <span style={{ fontWeight: "500" }}>Ghế đã chọn:</span>
                <span>
                    {selectedSeats.length === 0
                        ? "-"
                        : selectedSeats.map((s) => s.name).join(", ")}
                </span>
            </div>

            {/* Đồ ăn & Combo */}
            {selectedItems.length > 0 && (
                <div className="seat-summary__info seat-summary__food">
                    <span style={{ fontWeight: "500" }}>Đồ ăn & Combo:</span>
                    <div className="food-list">
                        {selectedItems.map((item) => (
                            <div key={`${item.type}-${item.id}`} className="food-item">
                                <span className="food-name">
                                    {item.name} × {item.qty}
                                </span>
                                <span className="food-price">
                                    {(item.price * item.qty).toLocaleString("vi-VN")} ₫
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tổng cộng */}
            <div className="seat-summary__total">
                <span style={{ fontWeight: "500", fontSize: "16px" }}>Tổng cộng:</span>
                <span style={{ fontWeight: "500", fontSize: "16px" }}>
                    {grandTotal.toLocaleString("vi-VN")} ₫
                </span>
            </div>

            {/* Nút */}
            <div className="seat-summary__buttons">
                <button className="btn-back" onClick={() => window.history.back()}>
                    Quay lại
                </button>
                <button
                    className="btn-continue"
                    onClick={() => {
                        if (selectedSeats.length === 0) {
                            message.warning("Vui lòng chọn ghế trước khi tiếp tục.");
                            return;
                        }
                        handleSepayPayment();
                        console.log("Proceed booking:", {
                            showtime,
                            movie,
                            seats: selectedSeats,
                            foods: selectedItems,
                            total,
                        });
                    }}
                >
                    Tiếp tục
                </button>
            </div>

            <Modal
                title="Quét mã QR để thanh toán"
                open={qrModalVisible}
                onCancel={() => handleCancel()}
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
                            <span style={{ color: "#fa541c" }}>{grandTotal.toLocaleString("vi-VN")}₫</span>
                        </p>
                    </div>
                ) : (
                    <p>Đang tải QR...</p>
                )}
            </Modal>
        </div>
    );
};

export default SeatSummary;
