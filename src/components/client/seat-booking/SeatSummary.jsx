const SeatSummary = ({ selectedSeats, total, showtime, movie, message }) => (
    <div className="seat-summary">
        <div className="seat-summary__info">
            <span>Ghế đã chọn:</span>
            <span>
                {selectedSeats.length === 0
                    ? "-"
                    : selectedSeats.map((s) => s.name).join(", ")}
            </span>
        </div>
        <div className="seat-summary__total">
            <span>Tổng cộng:</span>
            <span>{total.toLocaleString("vi-VN")} ₫</span>
        </div>

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
                        total,
                    });
                }}
            >
                Tiếp tục
            </button>
        </div>
    </div>
);

export default SeatSummary;
