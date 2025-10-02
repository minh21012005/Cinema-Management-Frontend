// ComboCard.jsx
import { Card, Typography, InputNumber, Tooltip } from "antd";
import StaffSellImage from "@/pages/staff/staff.sell.image";

const { Text } = Typography;

const FOOTER_HEIGHT = 52; // reserve space for InputNumber (px)

const ComboCard = ({ combo, quantity, onChangeQty, style }) => {
    const cardBaseStyle = {
        textAlign: "center",
        position: "relative",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...style,
    };

    const titleStyle = {
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: "1.2",
        minHeight: 40,
    };

    return (
        <Card
            style={cardBaseStyle}
            bodyStyle={{ padding: 12, display: "flex", flexDirection: "column", flex: 1 }}
        >
            {/* Ảnh */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                <StaffSellImage imageKey={combo.imageKey} width={120} height={120} />
            </div>

            {/* Nội dung chính */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                <div>
                    <Tooltip
                        title={
                            <div style={{ maxHeight: 200, overflowY: "auto" }}>
                                <div style={{ fontWeight: "bold", marginBottom: 5 }}>Chi tiết:</div>
                                {combo.foods.map((f) => (
                                    <div key={f.foodId}>- {f.foodName} x {f.quantity}</div>
                                ))}
                            </div>
                        }
                        placement="top"
                    >
                        <Text strong style={titleStyle}>
                            {combo.name}
                        </Text>
                    </Tooltip>
                </div>

                <div style={{ marginTop: 6 }}>
                    <Text>{combo.price}k</Text>
                </div>
            </div>

            {/* Footer: InputNumber */}
            <div style={{ marginTop: 8, height: FOOTER_HEIGHT }}>
                <InputNumber
                    min={0}
                    value={quantity}
                    onChange={(val) => onChangeQty(combo.id, val)}
                    style={{ width: "100%" }}
                />
            </div>
        </Card>
    );
};

export default ComboCard;
