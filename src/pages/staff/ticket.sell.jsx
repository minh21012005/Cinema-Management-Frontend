import { useState } from "react";
import { Card, Row, Col, Select, Button, Typography, Input, notification, Divider, InputNumber, Tabs } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const TICKET_PRICE = 100; // ví dụ 100k

const SellTicketPage = () => {
    // ------------------- State -------------------
    const [selectedCinema, setSelectedCinema] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [cartFood, setCartFood] = useState({});
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [foodSearch, setFoodSearch] = useState("");
    const [comboSearch, setComboSearch] = useState("");

    // ------------------- Sample Data -------------------
    const cinemas = [
        { id: 1, name: "Cinema A" },
        { id: 2, name: "Cinema B" },
    ];

    const rooms = {
        1: [{ id: 1, name: "Room 1" }, { id: 2, name: "Room 2" }],
        2: [{ id: 3, name: "Room 1" }, { id: 4, name: "Room 2" }],
    };

    const movies = {
        1: [{ id: 1, title: "Avengers" }, { id: 2, title: "Spider-Man" }],
        2: [{ id: 3, title: "Inception" }, { id: 4, title: "Interstellar" }],
    };

    const showtimes = {
        1: [{ id: 1, time: "10:00 AM" }, { id: 2, time: "1:00 PM" }],
        2: [{ id: 3, time: "11:00 AM" }, { id: 4, time: "2:00 PM" }],
    };

    const seatLayout = {
        1: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `A${i + 1}`, available: true })),
        2: Array.from({ length: 8 }, (_, i) => ({ id: i + 1, name: `B${i + 1}`, available: i % 3 !== 0 })),
    };

    const foods = [
        { id: 1, name: "Popcorn", price: 50 },
        { id: 2, name: "Coke", price: 30 },
        { id: 3, name: "Nachos", price: 40 },
    ];

    const combos = [
        { id: 101, name: "Combo 1", price: 100 },
        { id: 102, name: "Combo 2", price: 150 },
    ];

    // ------------------- Handlers -------------------
    const toggleSeat = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const changeFoodQty = (itemId, qty) => {
        setCartFood((prev) => ({ ...prev, [itemId]: qty }));
    };

    const totalPrice =
        selectedSeats.length * TICKET_PRICE +
        Object.entries(cartFood).reduce((sum, [id, qty]) => {
            const item = [...foods, ...combos].find((f) => f.id === Number(id));
            return sum + (item ? item.price * qty : 0);
        }, 0);

    const handleConfirm = () => {
        if (!customerName || !customerPhone) {
            notification.error({ message: "Please enter customer info" });
            return;
        }
        notification.success({
            message: "Order Created",
            description: `Seats: ${selectedSeats.join(", ")}\nItems: ${JSON.stringify(cartFood)}\nTotal: ${totalPrice}k`,
        });
        // Reset
        setSelectedSeats([]);
        setCartFood({});
        setSelectedCinema(null);
        setSelectedRoom(null);
        setSelectedMovie(null);
        setSelectedShowtime(null);
        setCustomerName("");
        setCustomerPhone("");
    };

    // ------------------- Render -------------------
    return (
        <div style={{ padding: 20 }}>
            <Title style={{ marginTop: "-15px" }} level={2}>Sell Ticket & Food/Combo</Title>

            <Row gutter={16}>
                {/* Left Panel */}
                <Col span={16}>
                    {/* Movie & Showtime */}
                    <Card title="Select Movie & Showtime" style={{ marginBottom: 20 }}>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Select
                                    placeholder="Cinema"
                                    value={selectedCinema}
                                    onChange={(val) => {
                                        setSelectedCinema(val);
                                        setSelectedRoom(null);
                                        setSelectedMovie(null);
                                        setSelectedShowtime(null);
                                        setSelectedSeats([]);
                                    }}
                                    style={{ width: "100%" }}
                                >
                                    {cinemas.map((c) => (
                                        <Option key={c.id} value={c.id}>
                                            {c.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col span={6}>
                                <Select
                                    placeholder="Room"
                                    value={selectedRoom}
                                    onChange={(val) => {
                                        setSelectedRoom(val);
                                        setSelectedMovie(null);
                                        setSelectedShowtime(null);
                                        setSelectedSeats([]);
                                    }}
                                    style={{ width: "100%" }}
                                    disabled={!selectedCinema}
                                >
                                    {(rooms[selectedCinema] || []).map((r) => (
                                        <Option key={r.id} value={r.id}>
                                            {r.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col span={6}>
                                <Select
                                    placeholder="Movie"
                                    value={selectedMovie}
                                    onChange={(val) => {
                                        setSelectedMovie(val);
                                        setSelectedShowtime(null);
                                        setSelectedSeats([]);
                                    }}
                                    style={{ width: "100%" }}
                                    disabled={!selectedRoom}
                                >
                                    {(movies[selectedRoom] || []).map((m) => (
                                        <Option key={m.id} value={m.id}>
                                            {m.title}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col span={6}>
                                <Select
                                    placeholder="Showtime"
                                    value={selectedShowtime}
                                    onChange={(val) => {
                                        setSelectedShowtime(val);
                                        setSelectedSeats([]);
                                    }}
                                    style={{ width: "100%" }}
                                    disabled={!selectedMovie}
                                >
                                    {(showtimes[selectedRoom] || []).map((s) => (
                                        <Option key={s.id} value={s.id}>
                                            {s.time}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>
                    </Card>

                    {/* Seat Layout */}
                    {selectedShowtime && (
                        <Card title="Select Seats">
                            <Row gutter={[8, 8]}>
                                {(seatLayout[selectedRoom] || []).map((seat) => (
                                    <Col key={seat.id} span={3}>
                                        <Button
                                            type={selectedSeats.includes(seat.id) ? "primary" : "default"}
                                            disabled={!seat.available}
                                            onClick={() => toggleSeat(seat.id)}
                                            block
                                            style={{
                                                backgroundColor: !seat.available
                                                    ? "#f5222d"
                                                    : selectedSeats.includes(seat.id)
                                                        ? "#1890ff"
                                                        : "#fff",
                                                color: !seat.available ? "#fff" : "#000",
                                            }}
                                        >
                                            {seat.name}
                                        </Button>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    )}

                    {/* Food / Combo Tabs */}
                    <Tabs defaultActiveKey="food" style={{ marginTop: 20 }}>
                        <TabPane tab="Food" key="food">
                            <Input
                                placeholder="Search Food"
                                value={foodSearch}
                                onChange={(e) => setFoodSearch(e.target.value)}
                                style={{ marginBottom: 10 }}
                            />
                            <Row gutter={16} style={{ maxHeight: 300, overflowY: "auto" }}>
                                {foods
                                    .filter((f) => f.name.toLowerCase().includes(foodSearch.toLowerCase()))
                                    .map((f) => (
                                        <Col key={f.id} span={6}>
                                            <Card>
                                                <Text strong>{f.name}</Text>
                                                <br />
                                                <Text>{f.price}k</Text>
                                                <InputNumber
                                                    min={0}
                                                    value={cartFood[f.id] || 0}
                                                    onChange={(val) => changeFoodQty(f.id, val)}
                                                    style={{ width: "100%", marginTop: 8 }}
                                                />
                                            </Card>
                                        </Col>
                                    ))}
                            </Row>
                        </TabPane>

                        <TabPane tab="Combo" key="combo">
                            <Input
                                placeholder="Search Combo"
                                value={comboSearch}
                                onChange={(e) => setComboSearch(e.target.value)}
                                style={{ marginBottom: 10 }}
                            />
                            <Row gutter={16} style={{ maxHeight: 300, overflowY: "auto" }}>
                                {combos
                                    .filter((c) => c.name.toLowerCase().includes(comboSearch.toLowerCase()))
                                    .map((c) => (
                                        <Col key={c.id} span={6}>
                                            <Card>
                                                <Text strong>{c.name}</Text>
                                                <br />
                                                <Text>{c.price}k</Text>
                                                <InputNumber
                                                    min={0}
                                                    value={cartFood[c.id] || 0}
                                                    onChange={(val) => changeFoodQty(c.id, val)}
                                                    style={{ width: "100%", marginTop: 8 }}
                                                />
                                            </Card>
                                        </Col>
                                    ))}
                            </Row>
                        </TabPane>
                    </Tabs>
                </Col>

                {/* Right Panel: Cart */}
                <Col span={8}>
                    <Card title="Cart & Payment">
                        <div>
                            <Text strong>Tickets:</Text>
                            {selectedSeats.length === 0 && <div>No tickets selected</div>}
                            {selectedSeats.map((s) => (
                                <div key={s}>
                                    Seat {s} - {TICKET_PRICE}k
                                </div>
                            ))}
                        </div>

                        <Divider />
                        <div>
                            <Text strong>Food / Combo:</Text>
                            {Object.entries(cartFood).filter(([id, qty]) => qty > 0).length === 0 && <div>No items</div>}
                            {Object.entries(cartFood)
                                .filter(([id, qty]) => qty > 0)
                                .map(([id, qty]) => {
                                    const item = [...foods, ...combos].find((f) => f.id === Number(id));
                                    return (
                                        <div key={id}>
                                            {item.name} x {qty} = {item.price * qty}k
                                        </div>
                                    );
                                })}
                        </div>

                        <Divider />
                        <div>
                            <Text strong>Total: {totalPrice}k</Text>
                        </div>

                        <Divider />
                        <Input
                            placeholder="Customer Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            style={{ marginBottom: 8 }}
                        />
                        <Input
                            placeholder="Customer Phone"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            style={{ marginBottom: 8 }}
                        />

                        <Button type="primary" block onClick={handleConfirm}>
                            Confirm & Pay
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SellTicketPage;
