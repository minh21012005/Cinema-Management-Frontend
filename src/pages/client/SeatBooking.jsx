import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "@/styles/seat-booking.css";
import { Col, message, Row } from "antd";
import SockJS from "sockjs-client";
import * as StompJs from "@stomp/stompjs";
import { fetchSeatLayoutAPI, getMediaUrlAPI } from "@/services/api.service";
import SeatMap from "../../components/client/seat-booking/SeatMap";
import SeatLegend from "../../components/client/seat-booking/SeatLegend";
import SeatInfo from "../../components/client/seat-booking/SeatInfo";
import SeatSummary from "../../components/client/seat-booking/SeatSummary";

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

    // --- WebSocket ---
    useEffect(() => {
        if (!showtime) return;
        const socket = new SockJS(socketUrl);
        const client = new StompJs.Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
            onConnect: () => {
                console.log("✅ Connected to WebSocket");
                client.subscribe(`/topic/seats/${showtime.id}`, (msg) => {
                    const newlyBookedSeats = JSON.parse(msg.body);
                    setSeatLayouts((prev) =>
                        prev.map((seat) =>
                            newlyBookedSeats.includes(seat.id)
                                ? { ...seat, booked: true }
                                : seat
                        )
                    );
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
        if (movie.posterKey) fetchPoster();
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
        if (res?.data) setPoster(res.data);
    };

    const toggleSeat = (seat) => {
        if (seat.booked) return;
        const isSelected = selectedSeats.some((s) => s.id === seat.id);
        setSelectedSeats((prev) =>
            isSelected ? prev.filter((s) => s.id !== seat.id) : [...prev, seat]
        );
    };

    const total = selectedSeats.reduce(
        (sum, seat) => sum + (seat.seatType?.basePrice || 0),
        0
    );

    return (
        <div className="seat-page">
            {/* Breadcrumb */}
            <div className="seat-breadcrumb">
                {["Chọn phim/rạp/suất", "Chọn ghế", "Chọn thức ăn", "Thanh toán", "Xác nhận"].map(
                    (step, index, arr) => (
                        <div
                            key={step}
                            className={`breadcrumb-step ${index === 1 ? "active" : index < 1 ? "completed" : ""
                                }`}
                        >
                            <div className="step-label">{step}</div>
                            {index < arr.length - 1 && <div className="step-arrow">→</div>}
                        </div>
                    )
                )}
            </div>

            {/* Layout */}
            <div className="seat-container-wrapper">
                <Row gutter={[24, 0]} className="seat-container">
                    {/* LEFT */}
                    <Col xs={24} sm={24} md={16} lg={16}>
                        <div className="seat-left">
                            <div className="seat-screen">
                                <div className="seat-screen__label">Màn hình</div>
                                <div className="seat-screen__bar" />
                            </div>
                            <SeatMap
                                seatLayouts={seatLayouts}
                                selectedSeats={selectedSeats}
                                toggleSeat={toggleSeat}
                            />
                            <SeatLegend />
                        </div>
                    </Col>

                    {/* RIGHT */}
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="seat-right">
                            <SeatInfo movie={movie} showtime={showtime} poster={poster} />
                            <SeatSummary
                                selectedSeats={selectedSeats}
                                total={total}
                                showtime={showtime}
                                movie={movie}
                                message={message}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SeatBooking;
