import { Card, Row, Col, Typography, Pagination } from "antd";
import ShowtimeCard from "./showtime.card";

const { Text } = Typography;

const ShowtimeList = ({
    showtimeData,
    selectedShowtime,
    setSelectedShowtime,
    setSelectedSeats,
    current,
    pageSize,
    total,
    setCurrent,
    setPageSize,
}) => (
    <Card title="Showtime" style={{ marginBottom: 20 }}>
        <Row gutter={[16, 16]}>
            {showtimeData.map((s) => (
                <Col key={s.id} span={6}>
                    <ShowtimeCard
                        showtime={s}
                        selected={selectedShowtime === s.id}
                        onSelect={() => {
                            setSelectedShowtime(s.id);
                            setSelectedSeats([]);
                        }}
                    />
                </Col>
            ))}
        </Row>

        <div style={{ marginTop: 16, textAlign: "center" }}>
            <Pagination
                current={current + 1}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                onChange={(p, s) => {
                    setCurrent(p - 1);
                    setPageSize(s);
                }}
            />
        </div>
    </Card>
);

export default ShowtimeList;
