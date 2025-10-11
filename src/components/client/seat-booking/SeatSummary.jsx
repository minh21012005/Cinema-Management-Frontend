const SeatSummary = ({ selectedSeats, total, showtime, movie, message, cartFood, foods, combos }) => {
    const selectedItems = Object.entries(cartFood)
        .filter(([_, qty]) => qty > 0)
        .map(([key, qty]) => {
            const [type, id] = key.split("-");
            const list = type === "food" ? foods : combos;
            const item = list.find((i) => i.id === Number(id));
            return { ...item, type, qty };
        });

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
                <span style={{ fontWeight: "500", fontSize: "16px" }}>{total.toLocaleString("vi-VN")} ₫</span>
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
        </div>
    );
};

export default SeatSummary;
