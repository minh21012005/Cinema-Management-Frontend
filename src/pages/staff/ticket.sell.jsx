import React, { useEffect, useState } from "react";
import { Row, Col, Input, notification } from "antd";
import Search from "antd/es/input/Search";
import SockJS from "sockjs-client";
import * as StompJs from "@stomp/stompjs";

import {
    fetchAllCombosActiveAPI,
    fetchAllFoodsActiveAPI,
    fetchSeatLayoutAPI,
    fetchShowtimeInDayForStaffAPI,
    staffHandleBookingAPI,
} from "@/services/api.service";
import ShowtimeList from "./showtime.list";
import SeatLayout from "@/components/seat/seat.layout";
import FoodComboTab from "./foodcombo.tab";
import CartPayment from "./cart.payment";

const SellTicketPage = () => {
    // ---------------- State ----------------
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [cartFood, setCartFood] = useState({});
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [foodSearch, setFoodSearch] = useState("");
    const [comboSearch, setComboSearch] = useState("");
    const [showtimeData, setShowtimeData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(8);
    const [total, setTotal] = useState(0);
    const [title, setTitle] = useState("");
    const [seatLayouts, setSeatLayouts] = useState([]);
    const [foods, setFoods] = useState([]);
    const [combos, setCombos] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    const token = window.localStorage.getItem("access_token");
    const baseWebSocketUrl = import.meta.env.VITE_BACKEND_WEBSOCKET_URL;
    const socketUrl = `${baseWebSocketUrl}/ws?accessToken=${token}`;

    // ---------------- WebSocket ----------------
    useEffect(() => {
        const socket = new SockJS(socketUrl);
        const client = StompJs.Stomp.over(socket);

        client.connect(
            () => console.log("Connected WS"),
            (err) => console.error("WS error", err)
        );

        setStompClient(client);
        return () => client.disconnect();
    }, []);

    useEffect(() => {
        if (stompClient && selectedShowtime) {
            const sub = stompClient.subscribe(`/topic/seats/${selectedShowtime}`, (msg) => {
                const bookedSeats = JSON.parse(msg.body);
                setSeatLayouts((prev) =>
                    prev.map((seat) =>
                        bookedSeats.includes(seat.id) ? { ...seat, booked: true } : seat
                    )
                );
            });
            return () => sub.unsubscribe();
        }
    }, [stompClient, selectedShowtime]);

    // ---------------- Fetch API ----------------
    useEffect(() => {
        fetchShowtimeInDayForStaffAPI(current, pageSize, title).then((res) => {
            if (res?.data) {
                setShowtimeData(res.data.result);
                setCurrent(res.data.meta.page);
                setPageSize(res.data.meta.pageSize);
                setTotal(res.data.meta.total);
            }
        });
    }, [current, pageSize, title]);

    useEffect(() => {
        if (selectedShowtime) {
            fetchSeatLayoutAPI(selectedShowtime).then((res) => {
                if (res.data) setSeatLayouts(res.data);
            });
        }
    }, [selectedShowtime]);

    useEffect(() => {
        fetchAllFoodsActiveAPI().then((res) => setFoods(res.data || []));
        fetchAllCombosActiveAPI().then((res) => setCombos(res.data || []));
    }, []);

    // ---------------- Handlers ----------------
    const onSearch = (value) => {
        setTitle(value?.trim() || null);
        setCurrent(0);
    };

    const toggleSeat = (seatId) =>
        setSelectedSeats((prev) =>
            prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
        );

    const changeFoodQty = (type, id, qty) =>
        setCartFood((prev) => ({ ...prev, [`${type}-${id}`]: qty }));

    const ticketPrice = (seat) => seat?.seatType?.basePrice || 0;

    const totalTicket = selectedSeats.reduce((sum, id) => {
        const seat = seatLayouts.find((s) => s.id === id);
        return sum + (seat ? ticketPrice(seat) : 0);
    }, 0);

    const totalFoodCombo = Object.entries(cartFood)
        .filter(([_, qty]) => qty > 0)
        .reduce((sum, [key, qty]) => {
            const [type, id] = key.split("-");
            const item =
                type === "food"
                    ? foods.find((f) => String(f.id) === id)
                    : combos.find((c) => String(c.id) === id);
            return sum + (item ? item.price * qty : 0);
        }, 0);

    const totalPrice = totalTicket + totalFoodCombo;

    const handleBooking = async () => {
        const bookingData = {
            staffId: 123,
            showtimeId: selectedShowtime,
            seats: selectedSeats.map((id) => {
                const seat = seatLayouts.find((s) => s.id === id);
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
            customerName,
            customerPhone,
        };

        const res = await staffHandleBookingAPI(bookingData);
        if (!res?.data) {
            notification.error({ message: "Failed", description: res.message });
        }
        setSelectedSeats([]);
    };

    return (
        <div style={{ padding: 20 }}>
            <Search
                placeholder="Nhập movie title..."
                allowClear
                onSearch={onSearch}
                style={{ width: 300, marginBottom: "10px" }}
            />

            <Row gutter={16}>
                {/* Left Panel */}
                <Col span={16}>
                    <ShowtimeList
                        showtimeData={showtimeData}
                        selectedShowtime={selectedShowtime}
                        setSelectedShowtime={setSelectedShowtime}
                        setSelectedSeats={setSelectedSeats}
                        current={current}
                        pageSize={pageSize}
                        total={total}
                        setCurrent={setCurrent}
                        setPageSize={setPageSize}
                    />

                    <SeatLayout
                        seats={seatLayouts}
                        selectedSeats={selectedSeats}
                        toggleSeat={toggleSeat}
                    />

                    <FoodComboTab
                        foods={foods}
                        combos={combos}
                        foodSearch={foodSearch}
                        comboSearch={comboSearch}
                        setFoodSearch={setFoodSearch}
                        setComboSearch={setComboSearch}
                        cartFood={cartFood}
                        changeFoodQty={changeFoodQty}
                    />
                </Col>

                {/* Right Panel */}
                <Col span={8}>
                    <CartPayment
                        selectedSeats={selectedSeats}
                        seatLayouts={seatLayouts}
                        foods={foods}
                        combos={combos}
                        cartFood={cartFood}
                        totalPrice={totalPrice}
                        customerName={customerName}
                        setCustomerName={setCustomerName}
                        customerPhone={customerPhone}
                        setCustomerPhone={setCustomerPhone}
                        ticketPrice={ticketPrice}
                        handleBooking={handleBooking}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default SellTicketPage;
