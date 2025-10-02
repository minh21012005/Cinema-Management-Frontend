// FoodCard.jsx
import { Card, Typography, InputNumber } from "antd";
import StaffSellImage from "@/pages/staff/staff.sell.image";

const { Text } = Typography;

const FOOTER_HEIGHT = 52; // giống ComboCard để đồng bộ InputNumber

const FoodCard = ({ food, quantity, onChangeQty, style }) => {
    return (
        <Card
            style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                height: "100%", // để card fill chiều cao Col
                ...style,
            }}
            bodyStyle={{ padding: 12, display: "flex", flexDirection: "column", flex: 1 }}
        >
            {/* Ảnh */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                <StaffSellImage imageKey={food.imageKey} width={120} height={120} />
            </div>

            {/* Nội dung chính (flex 1 để đẩy input xuống dưới) */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Text strong
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2, // tối đa 2 dòng
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: 40, // giữ đồng bộ chiều cao tên
                    }}
                >
                    {food.name}
                </Text>
                <Text style={{ marginTop: 6 }}>{food.price}k</Text>
            </div>

            {/* Footer: InputNumber cố định chiều cao */}
            <div style={{ marginTop: 8, height: FOOTER_HEIGHT }}>
                <InputNumber
                    min={0}
                    value={quantity}
                    onChange={(val) => onChangeQty(food.id, val)}
                    style={{ width: "100%" }}
                />
            </div>
        </Card>
    );
};

export default FoodCard;
