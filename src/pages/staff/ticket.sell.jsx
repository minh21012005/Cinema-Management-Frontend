import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Card,
    Typography,
    Input,
    Button,
    Divider,
    Tabs,
    InputNumber,
    Pagination,
} from "antd";
import { fetchAllCombosActiveAPI, fetchAllFoodsActiveAPI, fetchSeatLayoutAPI, fetchShowtimeInDayForStaffAPI } from "@/services/api.service";
import StaffSellImage from "@/pages/staff/staff.sell.image";
import Search from "antd/es/input/Search";
import SeatLayout from "@/components/seat/seat.layout";

const { Text } = Typography;
const { TabPane } = Tabs;

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

    // ---------------- Fetch API ----------------
    useEffect(() => {
        fetchShowtimes();
    }, [current, pageSize, title]);

    useEffect(() => {
        fetchSeatLayout();
    }, [selectedShowtime]);

    useEffect(() => {
        fetchFoods();
        fetchCombos();
    }, []);

    const fetchShowtimes = async () => {
        const res = await fetchShowtimeInDayForStaffAPI(current, pageSize, title);
        if (res && res.data) {
            setShowtimeData(res.data.result);
            setCurrent(res.data.meta.page);        // server trả 0-based
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.total);
        }
    };

    const fetchSeatLayout = async () => {
        const res = await fetchSeatLayoutAPI(selectedShowtime);
        if (res.data) {
            setSeatLayouts(res.data);
        }
    };

    const fetchFoods = async () => {
        const res = await fetchAllFoodsActiveAPI();
        if (res.data) {
            setFoods(res.data);
        }
    }

    const fetchCombos = async () => {
        const res = await fetchAllCombosActiveAPI();
        if (res.data) {
            setCombos(res.data);
        }
    }

    const onSearch = (value, _e, info) => {
        if (value) {
            let trimmedValue = value.trim();
            setTitle(trimmedValue);
            setCurrent(0); // reset về trang đầu tiên khi tìm kiếm
        } else {
            setTitle(null); // nếu không có giá trị tìm kiếm thì reset
            setCurrent(0); // reset về trang đầu tiên
        }
    }

    // ---------------- Handlers ----------------
    const toggleSeat = (seatId) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
        }
    };

    const changeFoodQty = (id, qty) => {
        setCartFood((prev) => ({ ...prev, [id]: qty }));
    };

    const ticketPrice = (seat) => {
        return seat?.seatType?.basePrice;
    };

    const totalTicket = selectedSeats.reduce((sum, id) => {
        const seat = seatLayouts.find((s) => s.id === id);
        return sum + (seat ? ticketPrice(seat) : 0);
    }, 0);

    const totalFoodCombo = Object.entries(cartFood)
        .filter(([_, qty]) => qty > 0)
        .reduce((sum, [id, qty]) => {
            const item = [...foods, ...combos].find((f) => f.id === Number(id));
            return sum + (item ? item.price * qty : 0);
        }, 0);

    const totalPrice = totalTicket + totalFoodCombo;

    return (
        <div style={{ padding: 20 }}>
            {/* Filter theo tên phim */}
            <Search
                placeholder="Nhập movie title..."
                allowClear
                onSearch={onSearch}
                style={{ width: 300, marginBottom: "10px" }}
            />

            <Row gutter={16}>
                {/* Left Panel */}
                <Col span={16}>
                    {/* Step 1: Select Showtime */}
                    <Card title="Showtime" style={{ marginBottom: 20 }}>
                        <Row gutter={[16, 16]}>
                            {showtimeData.map((s) => (
                                <Col key={s.id} span={6}>
                                    <Card
                                        hoverable
                                        onClick={() => {
                                            setSelectedShowtime(s.id);
                                            setSelectedSeats([]);
                                        }}
                                        style={{
                                            border: selectedShowtime === s.id
                                                ? "2px solid #1890ff"
                                                : "1px solid #f0f0f0",
                                            borderRadius: 8,
                                            textAlign: "center",
                                            height: 360,
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                flexGrow: 1,
                                            }}
                                        >
                                            <StaffSellImage imageKey={s.posterKey} width={160} height={220} />
                                        </div>

                                        <div style={{ marginTop: 10 }}>
                                            <Text strong>{s.movieTitle}</Text>
                                            <br />
                                            <Text type="secondary">
                                                {new Date(s.startTime).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })} -{" "}
                                                {new Date(s.endTime).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </Text>
                                            <br />
                                            <Text type="secondary">Room: {s.roomName}</Text>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Pagination */}
                        <div style={{ marginTop: 16, textAlign: "center" }}>
                            <Pagination
                                current={current + 1}       // 👈 hiển thị 1-based
                                pageSize={pageSize}
                                total={total}
                                showSizeChanger
                                onChange={(page, size) => {
                                    setCurrent(page - 1);    // 👈 convert về 0-based
                                    setPageSize(size);
                                }}
                                onShowSizeChange={(page, size) => {
                                    setCurrent(page - 1);
                                    setPageSize(size);
                                }}
                            />
                        </div>
                    </Card>

                    <SeatLayout
                        seats={seatLayouts}
                        selectedSeats={selectedSeats}
                        toggleSeat={toggleSeat}
                    />

                    {/* Step 4: Food / Combo */}
                    {selectedShowtime && (
                        <Card title="Food / Combo">
                            <Tabs defaultActiveKey="food">
                                <TabPane tab="Food" key="food">
                                    <Input
                                        placeholder="Search Food"
                                        value={foodSearch}
                                        onChange={(e) => setFoodSearch(e.target.value)}
                                        style={{ marginBottom: 10 }}
                                    />
                                    <Row gutter={16} style={{ maxHeight: 250, overflowY: "auto" }}>
                                        {foods
                                            .filter((f) => f.name.toLowerCase().includes(foodSearch.toLowerCase()))
                                            .map((f) => (
                                                <Col key={f.id} span={6}>
                                                    <Card style={{ textAlign: "center" }}>
                                                        {/* Hiển thị ảnh food */}
                                                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                                                            <StaffSellImage imageKey={f.imageKey} width={120} height={120} />
                                                        </div>

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
                                    <Row gutter={16} style={{ maxHeight: 250, overflowY: "auto" }}>
                                        {combos
                                            .filter((c) => c.name.toLowerCase().includes(comboSearch.toLowerCase()))
                                            .map((c) => (
                                                <Col key={c.id} span={6}>
                                                    <Card style={{ textAlign: "center" }}>
                                                        {/* Hiển thị ảnh combo */}
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                marginBottom: 8,
                                                            }}
                                                        >
                                                            <StaffSellImage imageKey={c.imageKey} width={120} height={120} />
                                                        </div>

                                                        <Text strong>{c.name}</Text>
                                                        <br />
                                                        <Text>{c.price}k</Text>
                                                        <br />

                                                        {/* Liệt kê chi tiết food trong combo */}
                                                        <div style={{ margin: "8px 0", fontSize: 12, color: "#555", textAlign: "left" }}>
                                                            {c.foods.map((f) => (
                                                                <div key={f.foodId}>
                                                                    - {f.foodName} x {f.quantity}
                                                                </div>
                                                            ))}
                                                        </div>
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
                        </Card>
                    )}
                </Col>

                {/* Right Panel: Cart & Payment */}
                <Col span={8}>
                    <Card title="Cart & Payment">
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
                            .map(([id, qty]) => {
                                const item = [...foods, ...combos].find((f) => f.id === Number(id));
                                return (
                                    <div key={id}>
                                        {item.name} x {qty} = {item.price * qty}k
                                    </div>
                                );
                            })}

                        <Divider />

                        <Text strong>Total: {totalPrice}k</Text>

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

                        <Button
                            type="primary"
                            block
                            disabled={totalPrice === 0}
                            onClick={() => {
                                // Log các giá trị
                                console.log("Selected Showtime:", selectedShowtime);
                                console.log("Selected Seats:", selectedSeats);
                                console.log(
                                    "Ticket Details:",
                                    selectedSeats.map((s) => {
                                        const seat = seatLayouts.find((seat) => seat.id === s);
                                        return {
                                            id: seat?.id,
                                            name: seat?.name,
                                            seatType: seat?.seatType?.name,
                                            price: ticketPrice(seat),
                                        };
                                    })
                                );

                                console.log(
                                    "Food/Combo Details:",
                                    Object.entries(cartFood)
                                        .filter(([_, qty]) => qty > 0)
                                        .map(([id, qty]) => {
                                            const item = [...foods, ...combos].find((f) => f.id === Number(id));
                                            return { id: item.id, name: item.name, price: item.price, quantity: qty };
                                        })
                                );

                                console.log("Customer Name:", customerName);
                                console.log("Customer Phone:", customerPhone);
                                console.log("Total Price:", totalPrice);

                                // TODO: Gọi API booking-service gửi dữ liệu
                            }}
                        >
                            Confirm & Pay
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SellTicketPage;
