import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "@/styles/booking.css";
import { Col, message, Row } from "antd";
import SockJS from "sockjs-client";
import * as StompJs from "@stomp/stompjs";
import { fetchAllCombosActiveAPI, fetchAllFoodsActiveAPI, fetchSeatLayoutAPI, getMediaUrlAPI } from "@/services/api.service";
import ClientFoodComboTab from "@/components/client/seat-booking/ClientFoodComboTab";
import SeatMap from "@/components/client/seat-booking/SeatMap";
import SeatLegend from "@/components/client/seat-booking/SeatLegend";
import SeatInfo from "@/components/client/seat-booking/SeatInfo";
import SeatSummary from "@/components/client/seat-booking/SeatSummary";

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
    const [foods, setFoods] = useState([]);
    const [combos, setCombos] = useState([]);
    const [foodSearch, setFoodSearch] = useState("");
    const [comboSearch, setComboSearch] = useState("");
    const [cartFood, setCartFood] = useState({});

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
                    const payload = JSON.parse(msg.body);

                    if (payload.type === "BOOKED") {
                        setSeatLayouts((prev) =>
                            prev.map((seat) =>
                                payload.seatIds.includes(seat.id)
                                    ? { ...seat, booked: true }
                                    : seat
                            )
                        );
                    } else if (payload.type === "RELEASED") {
                        setSeatLayouts((prev) =>
                            prev.map((seat) =>
                                payload.seatIds.includes(seat.id)
                                    ? { ...seat, booked: false }
                                    : seat
                            )
                        );
                    }
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

    useEffect(() => {
        fetchAllFoodsActiveAPI().then((res) => setFoods(res.data || []));
        fetchAllCombosActiveAPI().then((res) => setCombos(res.data || []));
    }, []);

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

    // Tổng tiền ghế
    const seatTotal = selectedSeats.reduce(
        (sum, seat) => sum + (seat.seatType?.basePrice || 0),
        0
    );

    // Tính tổng tiền đồ ăn + combo
    const foodComboTotal = Object.entries(cartFood).reduce((sum, [key, qty]) => {
        if (!qty) return sum;
        const [type, id] = key.split("-");
        const list = type === "food" ? foods : combos;
        const item = list.find((i) => i.id === Number(id));
        return sum + (item?.price || 0) * qty;
    }, 0);

    // Tổng cộng
    const total = seatTotal + foodComboTotal;

    return (
        <div className="seat-page">
            <div className="seat-breadcrumb">
                Mua vé xem phim
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
                            <ClientFoodComboTab
                                foods={foods}
                                combos={combos}
                                foodSearch={foodSearch}
                                comboSearch={comboSearch}
                                setFoodSearch={setFoodSearch}
                                setComboSearch={setComboSearch}
                                cartFood={cartFood}
                                changeFoodQty={(type, id, qty) =>
                                    setCartFood((prev) => ({ ...prev, [`${type}-${id}`]: qty }))
                                }
                            />
                        </div>
                    </Col>

                    {/* RIGHT */}
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="seat-right">
                            <SeatInfo movie={movie} showtime={showtime} poster={poster} />
                            <SeatSummary
                                selectedSeats={selectedSeats}
                                setSelectedSeats={setSelectedSeats}
                                total={total}
                                showtime={showtime}
                                movie={movie}
                                message={message}
                                cartFood={cartFood}
                                foods={foods}
                                combos={combos}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        </div >
    );
};

export default SeatBooking;