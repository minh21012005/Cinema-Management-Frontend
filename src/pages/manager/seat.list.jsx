import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tooltip, Row, Col } from "antd";
import { fetchAllSeatByRoomIdAPI, fetchRoomByIdAPI } from "@/services/api.service";

const SeatListPage = () => {
    const { id } = useParams();
    const [seats, setSeats] = useState([]);
    const [room, setRoom] = useState(null);

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

    // style ghế
    const getSeatStyle = (seat) => {
        const base = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            cursor: seat.active ? "pointer" : "not-allowed",
            color: "#fff",
            border: "1px solid #999",
        };

        if (seat.booked) {
            return { ...base, backgroundColor: "#ff4d4f", width: 35, height: 35 };
        }

        switch (seat.seatType?.name) {
            case "VIP":
                return { ...base, backgroundColor: seat.active ? "#fa8c16" : "#d9d9d9", width: 35, height: 35 };
            case "Đôi":
                return { ...base, backgroundColor: seat.active ? "#ff4d4f" : "#d9d9d9", width: 70, height: 35 };
            default:
                return { ...base, backgroundColor: seat.active ? "#52c41a" : "#d9d9d9", width: 35, height: 35 };
        }
    };

    return (
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
                    <Row key={row} gutter={[8, 8]} align="middle" justify="center" style={{ marginBottom: 20 }}>
                        {/* ký hiệu hàng */}
                        <Col>
                            <strong>{row}</strong>
                        </Col>
                        {rows[row].map((seat) => (
                            <Col key={seat.id}>
                                <Tooltip title={`Ghế ${seat.name} (${seat.seatType?.name})`}>
                                    <div style={getSeatStyle(seat)}>{seat.name.slice(1)}</div>
                                </Tooltip>
                            </Col>
                        ))}
                    </Row>
                ))}

            {/* Legend */}
            <div style={{ marginTop: 40, display: "flex", gap: 30, justifyContent: "center", flexWrap: "wrap" }}>
                <Legend color="#52c41a" label="Thường" />
                <Legend color="#fa8c16" label="VIP" />
                <Legend color="#ff4d4f" label="Đôi" wide />
                <Legend color="#d9d9d9" label="Inactive" />
            </div>
        </div>
    );
};

// component legend gọn gàng
const Legend = ({ color, label, wide }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: wide ? 40 : 20, height: 20, background: color, borderRadius: 4 }} />
        {label}
    </div>
);

export default SeatListPage;
