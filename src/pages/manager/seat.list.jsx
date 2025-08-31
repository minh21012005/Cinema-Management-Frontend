import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tooltip, Row, Col } from "antd";
import { fetchAllSeatByRoomIdAPI, fetchRoomByIdAPI } from "@/services/api.service";
import SeatModal from "@/components/seat/seat.modal";

const CELL = 36;       // chiều rộng 1 ghế đơn
const GAP = 5;         // khoảng cách giữa các ghế
const DOUBLE = CELL * 2; // chiều rộng ghế đôi (2 ghế + 1 gap ở giữa)

const SeatListPage = () => {
    const { id } = useParams();
    const [seats, setSeats] = useState([]);
    const [room, setRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [seatSelected, setSeatSelected] = useState(null);

    const maxCol = Math.max(
        ...seats.map((s) => {
            const nums = s.name.slice(1).split("-");
            return Math.max(...nums.map((n) => parseInt(n, 10)));
        }),
        0
    );

    useEffect(() => {
        fetchSeats();
        fetchRoom();
    }, [id]);

    const fetchRoom = async () => {
        try {
            const res = await fetchRoomByIdAPI(id);
            setRoom(res.data);
        } catch (err) {
            console.error("Error loading room:", err);
        }
    };

    const fetchSeats = async () => {
        try {
            const res = await fetchAllSeatByRoomIdAPI(id);
            setSeats(res.data);
        } catch (err) {
            console.error("Error loading seats:", err);
        }
    };

    // Group seats theo row (A, B, C...)
    const rows = {};
    seats.forEach((seat) => {
        const row = seat.name.charAt(0);
        if (!rows[row]) rows[row] = [];
        rows[row].push(seat);
    });

    // Sort ghế trong từng row
    Object.keys(rows).forEach((row) => {
        rows[row].sort((a, b) => {
            const numA = parseInt(a.name.slice(1), 10);
            const numB = parseInt(b.name.slice(1), 10);
            return numA - numB;
        });
    });

    const getSeatStyle = (seat) => {
        const base = {
            width: "100%",
            height: CELL * 0.9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 500,
            cursor: seat.active ? "pointer" : "not-allowed",
            color: "#fff",
            border: "1px solid #999",
            boxSizing: "border-box",
        };

        switch (seat.seatType?.name) {
            case "VIP":
                return { ...base, backgroundColor: seat.active ? "#fa8c16" : "#999999" }; // cam sáng vừa phải
            case "Đôi":
                return { ...base, backgroundColor: seat.active ? "#ff7875" : "#999999" }; // đỏ hồng nhẹ
            default: // Thường
                return { ...base, backgroundColor: seat.active ? "#42A5F5" : "#999999" }; // xám trung
        }
    };

    const showModal = (seat) => {
        setSeatSelected(seat);
        setIsModalOpen(true);
    }

    return (
        <>
            <div style={{ padding: 24, textAlign: "center" }}>
                <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
                    {room ? room.name : "Loading..."}
                </h2>

                {/* Màn hình */}
                <div
                    style={{
                        width: "70%",
                        margin: "0 auto 40px",
                        background: "#333",
                        color: "#fff",
                        height: 30,
                        lineHeight: "30px",
                        borderRadius: "0 0 20px 20px",
                    }}
                >
                    SCREEN
                </div>

                {Object.keys(rows)
                    .sort()
                    .map((row) => (
                        <Row
                            key={row}
                            gutter={[GAP, GAP]}
                            justify="center"
                            align="middle"
                            wrap={false} // không cho xuống hàng để giữ layout chuẩn
                            style={{ marginBottom: 5 }}
                        >
                            {/* Ký hiệu hàng */}
                            <Col flex="24px" style={{ textAlign: "right", marginRight: 10 }}>
                                <strong>{row}</strong>
                            </Col>

                            {Array.from({ length: maxCol }, (_, i) => {
                                const colNum = i + 1;

                                // tìm ghế trùng cột
                                const seat = rows[row]?.find((s) => {
                                    if (s.name.includes("-")) {
                                        const [start, end] = s.name
                                            .slice(1)
                                            .split("-")
                                            .map((n) => parseInt(n, 10));
                                        return colNum >= start && colNum <= end;
                                    }
                                    return parseInt(s.name.slice(1), 10) === colNum;
                                });

                                if (!seat) {
                                    // ô trống để giữ cột
                                    return (
                                        <Col key={`${row}-${colNum}`} flex={`${CELL}px`}>
                                            <div style={{ width: "100%", height: CELL }} />
                                        </Col>
                                    );
                                }

                                if (seat.name.includes("-")) {
                                    // chỉ render 1 lần tại cột start, với ô flex = tổng 2 ghế + 1 gap
                                    const [start] = seat.name
                                        .slice(1)
                                        .split("-")
                                        .map((n) => parseInt(n, 10));
                                    if (colNum !== start) return null;

                                    return (
                                        <Col key={seat.id} flex={`${DOUBLE}px`}>
                                            <Tooltip title={`Ghế ${seat.name} (${seat.seatType?.name})`}>
                                                <div onClick={() => { showModal(seat) }} style={getSeatStyle(seat)}>{seat.name.slice(1)}</div>
                                            </Tooltip>
                                        </Col>

                                    );
                                }

                                // ghế đơn
                                return (
                                    <Col key={seat.id} flex={`${CELL}px`}>
                                        <Tooltip title={`Ghế ${seat.name} (${seat.seatType?.name})`}>
                                            <div onClick={() => { showModal(seat) }} style={getSeatStyle(seat)}>{seat.name.slice(1)}</div>
                                        </Tooltip>
                                    </Col>
                                );
                            })}
                        </Row>
                    ))}

                {/* Legend */}
                <div
                    style={{
                        marginTop: 40,
                        display: "flex",
                        gap: 30,
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <Legend color="#42A5F5" label="Thường" />
                    <Legend color="#fa8c16" label="VIP" />
                    <Legend color="#ff7875" label="Đôi" wide />
                    <Legend color="#999999" label="Inactive" />
                </div>
            </div>
            <SeatModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                seatSelected={seatSelected}
                setSeatSelected={setSeatSelected}
                fetchSeats={fetchSeats}
            />
        </>
    );
};

const Legend = ({ color, label, wide }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: wide ? 40 : 20, height: 20, background: color, borderRadius: 4 }} />
        {label}
    </div>
);

export default SeatListPage;
