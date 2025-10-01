import React from "react";
import { Button, Row, Col, Divider } from "antd";

const SeatLayout = ({ seats, selectedSeats, toggleSeat }) => {
    if (!Array.isArray(seats)) return <p>No seats available</p>;

    // Gom nhóm seat theo rowIndex
    const grouped = seats.reduce((acc, seat) => {
        if (!acc[seat.rowIndex]) acc[seat.rowIndex] = [];
        acc[seat.rowIndex].push(seat);
        acc[seat.rowIndex].sort((a, b) => a.colIndex - b.colIndex);
        return acc;
    }, {});

    return (
        <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: 16 }}>Màn hình</h3>
            <div
                style={{
                    backgroundColor: "#ddd",
                    height: 16,
                    marginBottom: 24,
                    borderRadius: 4,
                    width: "60%",
                    margin: "0 auto",
                }}
            />

            {Object.keys(grouped).map((rowIdx) => (
                <Row key={rowIdx} justify="center" style={{ marginBottom: 8 }}>
                    {grouped[rowIdx].map((seat) => {
                        const isSelected = selectedSeats.includes(seat.id);

                        // Nếu ghế đôi -> render button kéo dài
                        if (seat.seatType.name === "Đôi") {
                            return (
                                <Button
                                    key={seat.id}
                                    onClick={() => toggleSeat(seat.id)}
                                    disabled={seat.booked}
                                    style={{
                                        margin: 2,
                                        width: 68, // gấp đôi ghế thường
                                        height: 32,
                                        borderRadius: 4,
                                        backgroundColor: seat.booked
                                            ? "#999" // booked
                                            : isSelected
                                                ? "#8B0000" // selected (nâu đỏ)
                                                : "#fff",
                                        border: "2px solid hotpink", // viền hồng
                                        fontSize: 12,
                                        padding: 0,
                                    }}
                                >
                                    {seat.name}
                                </Button>
                            );
                        }

                        // Ghế thường + VIP
                        return (
                            <Button
                                key={seat.id}
                                onClick={() => toggleSeat(seat.id)}
                                disabled={seat.booked}
                                style={{
                                    margin: 2,
                                    width: 32,
                                    height: 32,
                                    borderRadius: 4,
                                    backgroundColor: seat.booked
                                        ? "#999"
                                        : isSelected
                                            ? "#8B0000" // nâu đỏ cho selected
                                            : "#fff",
                                    border:
                                        seat.seatType.name === "VIP"
                                            ? "2px solid #ff4d4f"
                                            : "1px solid #4CAF50",
                                    fontSize: 12,
                                    padding: 0,
                                }}
                            >
                                {seat.name}
                            </Button>
                        );
                    })}
                </Row>
            ))}

            {/* Legend */}
            <Divider />
            <Row style={{ marginBottom: "20px" }} justify="center" gutter={16}>
                <Col>
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            border: "1px solid #4CAF50",
                            display: "inline-block",
                            marginRight: 8,
                        }}
                    />
                    Thường
                </Col>
                <Col>
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            border: "2px solid #ff4d4f",
                            display: "inline-block",
                            marginRight: 8,
                        }}
                    />
                    VIP
                </Col>
                <Col>
                    <div
                        style={{
                            width: 36,
                            height: 20,
                            border: "2px solid hotpink",
                            display: "inline-block",
                            marginRight: 8,
                        }}
                    />
                    Ghế đôi
                </Col>
                <Col>
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            border: "1px solid #999",
                            backgroundColor: "#8B0000",
                            display: "inline-block",
                            marginRight: 8,
                        }}
                    />
                    Đang chọn
                </Col>
                <Col>
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            border: "1px solid #999",
                            backgroundColor: "#999",
                            display: "inline-block",
                            marginRight: 8,
                        }}
                    />
                    Đã đặt
                </Col>
            </Row>
        </div>
    );
};

export default SeatLayout;
