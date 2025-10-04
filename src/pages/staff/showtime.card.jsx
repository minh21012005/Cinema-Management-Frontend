import { Card, Typography } from "antd";
import StaffSellImage from "./staff.sell.image";

const { Text } = Typography;

const ShowtimeCard = ({ showtime, selected, onSelect }) => (
    <Card
        hoverable
        onClick={onSelect}
        style={{
            border: selected ? "2px solid #1890ff" : "1px solid #f0f0f0",
            borderRadius: 8,
            textAlign: "center",
            height: 360,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
        }}
    >
        <div style={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
            <StaffSellImage imageKey={showtime.posterKey} width={160} height={220} />
        </div>

        <div style={{ marginTop: 10 }}>
            <Text strong>{showtime.movieTitle}</Text>
            <br />
            <Text type="secondary">
                {new Date(showtime.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
                {" - "}
                {new Date(showtime.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </Text>
            <br />
            <Text type="secondary">Room: {showtime.roomName}</Text>
        </div>
    </Card>
);

export default ShowtimeCard;
