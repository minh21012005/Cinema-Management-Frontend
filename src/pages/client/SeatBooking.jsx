import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "@/styles/seat-booking.css"; // tách CSS riêng
import { Col, Row } from "antd";

const fakeMovie = {
    title: "Chú Thuật Hồi Chiến: Hoài Ngọc / Ngọc Chiết",
    poster:
        "https://cdn.galaxycine.vn/media/2025/9/30/jujutsu-kaisen-500_1759216418459.jpg",
    cinema: "Galaxy Nguyễn Du - RẠP 5",
    rating: "T13",
};

const fakeShowtimes = [
    { id: 1, time: "09:45", date: "10/10/2025", hall: "RAP 5", price: 90000 }
];

function generateSeats(rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"], cols = 9) {
    const result = {};
    rows.forEach((r, idx) => {
        const seats = [];
        for (let c = 1; c <= cols; c++) {
            const id = `${r}${c}`;
            const sold = (idx + c) % 11 === 0;
            const vip = (idx === 0 && c >= 7) || (idx === 1 && c >= 8);
            seats.push({
                id,
                row: r,
                number: c,
                status: sold ? "sold" : vip ? "vip" : "available",
            });
        }
        result[r] = seats;
    });
    return result;
}

export default function SeatBooking() {
    const location = useLocation();
    const showtime = location.state?.showtime;
    useEffect(() => console.log(showtime), []);

    const [showtimes] = useState(fakeShowtimes);
    const [activeShowtimeId, setActiveShowtimeId] = useState(showtimes[0].id);
    const [seatsMap] = useState(() => generateSeats());
    const [selectedSeats, setSelectedSeats] = useState([]);

    const activeShowtime = useMemo(
        () => showtimes.find((s) => s.id === activeShowtimeId),
        [showtimes, activeShowtimeId]
    );

    const toggleSeat = (seat) => {
        if (seat.status === "sold") return;
        const isSelected = selectedSeats.some((s) => s.id === seat.id);
        setSelectedSeats((prev) =>
            isSelected ? prev.filter((s) => s.id !== seat.id) : [...prev, seat]
        );
    };

    const seatState = (seat) => {
        if (seat.status === "sold") return "sold";
        if (selectedSeats.some((s) => s.id === seat.id)) return "selected";
        if (seat.status === "vip") return "vip";
        return "available";
    };

    const total = selectedSeats.reduce(
        (sum) => sum + (activeShowtime ? activeShowtime.price : 0),
        0
    );

    const onClickPill = (s) => {
        console.log("Clicked showtime:", s);
        setActiveShowtimeId(s.id);
        setSelectedSeats([]);
    };

    return (
        <div className="seat-page">
            <div className="seat-breadcrumb">
                {["Chọn phim/rạp/suất", "Chọn ghế", "Chọn thức ăn", "Thanh toán", "Xác nhận"].map((step, index, arr) => (
                    <div key={step} className={`breadcrumb-step ${index === 1 ? "active" : index < 1 ? "completed" : ""}`}>
                        <div className="step-label">{step}</div>
                        {index < arr.length - 1 && <div className="step-arrow">→</div>}
                    </div>
                ))}
            </div>

            <div className="seat-container-wrapper">

                <Row gutter={[24, 0]} className="seat-container">
                    {/* LEFT */}
                    <Col xs={24} sm={24} md={16} lg={17}>
                        <div className="seat-left">
                            <div className="seat-screen">
                                <div className="seat-screen__label">Màn hình</div>
                                <div className="seat-screen__bar" />
                            </div>

                            <div className="seat-map">
                                <div className="seat-map__rows">
                                    {Object.keys(seatsMap)
                                        .slice()
                                        .map((row) => (
                                            <div key={row} className="seat-row">
                                                <div className="seat-row__label">{row}</div>
                                                <div className="seat-row__seats">
                                                    {seatsMap[row].map((seat) => (
                                                        <button
                                                            key={seat.id}
                                                            className={`seat-btn seat-btn--${seatState(seat)}`}
                                                            onClick={() => toggleSeat(seat)}
                                                        >
                                                            {seat.number}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="seat-row__label">{row}</div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Legend */}
                            {/* Legend */}
                            <div className="seat-legend">
                                <div className="seat-legend__group">
                                    <div className="seat-legend__item">
                                        <span className="seat-box sold" /> Ghế đã bán
                                    </div>
                                    <div className="seat-legend__item">
                                        <span className="seat-box selected" /> Ghế đang chọn
                                    </div>
                                </div>

                                <div className="seat-legend__group">
                                    <div className="seat-legend__item">
                                        <span className="seat-box vip" /> Ghế VIP
                                    </div>
                                    <div className="seat-legend__item">
                                        <span className="seat-box normal" /> Ghế đơn
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* RIGHT */}
                    <Col xs={24} sm={24} md={8} lg={7}>
                        <div className="seat-right">
                            <div className="seat-info">
                                <img src={fakeMovie.poster} alt="poster" className="seat-poster" />
                                <div className="seat-details">
                                    <h3>{fakeMovie.title}</h3>
                                    <p>2D Phụ Đề • {fakeMovie.rating}</p>
                                    <p><strong>{fakeMovie.cinema}</strong></p>
                                    <p>
                                        Suất: <b>{activeShowtime?.time}</b> - {activeShowtime?.date}
                                    </p>
                                </div>
                            </div>

                            <div className="seat-summary">
                                <div className="seat-summary__info">
                                    <span>Ghế đã chọn:</span>
                                    <span>
                                        {selectedSeats.length === 0
                                            ? "-"
                                            : selectedSeats.map((s) => s.id).join(", ")}
                                    </span>
                                </div>
                                <div className="seat-summary__total">
                                    <span>Tổng cộng:</span>
                                    <span>{total.toLocaleString("vi-VN")} ₫</span>
                                </div>

                                <div className="seat-summary__buttons">
                                    <button className="btn-back" onClick={() => setSelectedSeats([])}>
                                        Quay lại
                                    </button>
                                    <button
                                        className="btn-continue"
                                        onClick={() => {
                                            if (selectedSeats.length === 0) {
                                                alert("Vui lòng chọn ghế trước khi tiếp tục.");
                                                return;
                                            }
                                            console.log("Proceed booking:", {
                                                showtime: activeShowtime,
                                                seats: selectedSeats,
                                                total,
                                            });
                                        }}
                                    >
                                        Tiếp tục
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

        </div>
    );
}
