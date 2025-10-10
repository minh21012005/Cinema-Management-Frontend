import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "@/styles/seat-booking.css"; // tách CSS riêng
import { Col, message, Row } from "antd";
import SockJS from "sockjs-client";
import * as StompJs from "@stomp/stompjs";
import { fetchSeatLayoutAPI, getMediaUrlAPI } from "@/services/api.service";

const SeatBooking = () => {

    const location = useLocation();
    const showtime = location.state?.showtime;
    const movie = location.state?.movie;
    const [poster, setPoster] = useState(null);
    const token = window.localStorage.getItem("access_token");
    const baseWebSocketUrl = import.meta.env.VITE_BACKEND_WEBSOCKET_URL;
    const socketUrl = `${baseWebSocketUrl}/ws?accessToken=${token}`;
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatLayouts, setSeatLayouts] = useState([]);

    // ---------------- WebSocket ----------------
    useEffect(() => {
        if (!showtime) return;

        const socket = new SockJS(socketUrl);
        const client = new StompJs.Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // Tự động reconnect nếu rớt
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("✅ Connected to WebSocket");

                // Subscribe ngay khi connect thành công
                client.subscribe(`/topic/seats/${showtime.id}`, (msg) => {
                    const newlyBookedSeats = JSON.parse(msg.body);

                    setSeatLayouts((prev) =>
                        prev.map((seat) =>
                            newlyBookedSeats.includes(seat.id)
                                ? { ...seat, booked: true } // chỉ đánh dấu thêm ghế mới
                                : seat // giữ nguyên trạng thái cũ
                        )
                    );

                    // Nếu ghế khách đang chọn bị staff bán thì bỏ khỏi danh sách chọn
                    setSelectedSeats((prev) =>
                        prev.filter((seat) => !newlyBookedSeats.includes(seat.id))
                    );
                });
            },
            onStompError: (frame) => {
                console.error("Broker error:", frame.headers["message"]);
            },
        });

        client.activate();
        return () => {
            if (client.active) client.deactivate();
        };
    }, [showtime]);

    useEffect(() => {
        if (movie.posterKey) {
            fetchPoster();
        }
    }, [movie.posterKey]);

    useEffect(() => {
        if (showtime) {
            fetchSeatLayoutAPI(showtime.id).then((res) => {
                if (res.data) setSeatLayouts(res.data);
            });
        }
    }, [showtime]);

    const fetchPoster = async () => {
        const res = await getMediaUrlAPI(movie.posterKey);
        if (res?.data) {
            console.log(res.data);
            setPoster(res.data);
        }
    }

    const toggleSeat = (seat) => {
        if (seat.booked) return; // đã đặt rồi thì không được chọn
        const isSelected = selectedSeats.some((s) => s.id === seat.id);
        setSelectedSeats((prev) =>
            isSelected ? prev.filter((s) => s.id !== seat.id) : [...prev, seat]
        );
    };

    const total = selectedSeats.reduce((sum, seat) => sum + (seat.seatType?.basePrice || 0), 0);

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
                    <Col xs={24} sm={24} md={16} lg={16}>
                        <div className="seat-left">
                            <div className="seat-screen">
                                <div className="seat-screen__label">Màn hình</div>
                                <div className="seat-screen__bar" />
                            </div>

                            <div className="seat-map">
                                <div className="seat-map__rows">
                                    {Object.values(
                                        seatLayouts.reduce((acc, seat) => {
                                            const row = seat.name[0]; // lấy ký tự đầu làm hàng, ví dụ "E6" → "E"
                                            if (!acc[row]) acc[row] = [];
                                            acc[row].push(seat);
                                            return acc;
                                        }, {})
                                    ).map((rowSeats, idx) => {
                                        const rowName = rowSeats[0]?.name[0];
                                        return (
                                            <div key={rowName || idx} className="seat-row">
                                                <div className="seat-row__label">{rowName}</div>
                                                <div className="seat-row__seats">
                                                    {rowSeats
                                                        .sort((a, b) => a.colIndex - b.colIndex)
                                                        .map((seat) => (
                                                            <button
                                                                key={seat.id}
                                                                className={`seat-btn 
                                                                    ${seat.seatType?.name === "Đôi" ? "seat-btn--couple" : ""} 
                                                                    ${seat.seatType?.name === "VIP" ? "seat-btn--vip" : ""} 
                                                                    ${seat.booked ? "seat-btn--sold" : ""} 
                                                                    ${selectedSeats.some((s) => s.id === seat.id) ? "seat-btn--selected" : ""} `}
                                                                onClick={() => toggleSeat(seat)}
                                                                disabled={seat.booked}
                                                            >
                                                                {seat.name.replace(/^[A-Z]/, "")}
                                                            </button>
                                                        ))}
                                                </div>
                                                <div className="seat-row__label">{rowName}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

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
                                        <span className="seat-box normal" /> Ghế đơn
                                    </div>
                                    <div className="seat-legend__item">
                                        <span className="seat-box vip" /> Ghế VIP
                                    </div>
                                    <div className="seat-legend__item">
                                        <span className="seat-box couple" /> Ghế đôi
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* RIGHT */}
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="seat-right">
                            <div className="seat-info">
                                <img
                                    src={poster || "/default-poster.jpg"} // fallback nếu chưa có poster
                                    alt={movie.title || "poster"}
                                    className="seat-poster"
                                />
                                <div className="seat-details">
                                    <h3>{movie?.title || "Đang cập nhật"}</h3>
                                    <p style={{ marginTop: "10px" }} className="movie-meta">
                                        <strong>Thể loại:</strong> {movie?.categoryNames?.join(", ")}
                                    </p>
                                    <p>
                                        <strong>
                                            {showtime?.cinemaName} - {showtime?.roomName}
                                        </strong>
                                    </p>
                                    <p>
                                        Suất:{" "}
                                        <b>
                                            {new Date(showtime?.startTime).toLocaleTimeString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </b>{" "}
                                        -{" "}
                                        {new Date(showtime?.endTime).toLocaleTimeString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                    <p>
                                        Ngày chiếu:{" "}
                                        {new Date(showtime?.startTime).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>
                            </div>

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
                        </div>
                    </Col>

                </Row>
            </div>

        </div>
    );
}

export default SeatBooking;
