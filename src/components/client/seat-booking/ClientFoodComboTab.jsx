import { Row, Col, Tabs, Input, Card, InputNumber, Typography } from "antd";
import ClientImage from "./ClientImage";

const { TabPane } = Tabs;
const { Text, Title } = Typography;

const CARD_HEIGHT = 260;
const IMAGE_BOX_HEIGHT = 120;
const NAME_HEIGHT = 44;

const ClientFoodComboTab = ({
    foods,
    combos,
    foodSearch,
    comboSearch,
    setFoodSearch,
    setComboSearch,
    cartFood,
    changeFoodQty,
}) => {
    const renderCard = (item, type) => (
        <Card
            bordered
            style={{
                width: "100%",
                height: CARD_HEIGHT,
                borderRadius: 8,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
            bodyStyle={{
                padding: 12,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
            }}
        >
            {/* Hình ảnh */}
            <div
                style={{
                    height: IMAGE_BOX_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                }}
            >
                <ClientImage
                    imageKey={item.imageKey}
                    alt={item.name}
                    maxWidth={120}
                    maxHeight={120}
                />
            </div>

            {/* Tên & giá */}
            <div>
                <Title
                    level={5}
                    style={{
                        fontSize: 14,
                        fontWeight: 600,
                        minHeight: NAME_HEIGHT,
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {item.name}
                </Title>
                <Text type="danger" strong>
                    {item.price}k
                </Text>
            </div>

            {/* Input số lượng */}
            <InputNumber
                min={0}
                value={cartFood[`${type}-${item.id}`] || 0}
                onChange={(value) => changeFoodQty(type, item.id, value || 0)}
                style={{
                    width: "100%",
                    marginBottom: 30,
                    borderRadius: 6,
                }}
            />
        </Card>
    );

    return (
        <Tabs defaultActiveKey="food" style={{ marginTop: 30 }}>
            <TabPane tab="Đồ ăn" key="food">
                <Input
                    placeholder="Tìm kiếm món ăn"
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    allowClear
                    style={{ marginBottom: 12 }}
                />
                <Row gutter={[16, 16]} style={{ maxHeight: 420, overflowY: "auto" }}>
                    {foods
                        .filter((f) =>
                            f.name.toLowerCase().includes(foodSearch.toLowerCase())
                        )
                        .map((f) => (
                            <Col key={f.id} span={6} style={{ display: "flex" }}>
                                {renderCard(f, "food")}
                            </Col>
                        ))}
                </Row>
            </TabPane>

            <TabPane tab="Combo" key="combo">
                <Input
                    placeholder="Tìm kiếm combo"
                    value={comboSearch}
                    onChange={(e) => setComboSearch(e.target.value)}
                    allowClear
                    style={{ marginBottom: 12 }}
                />
                <Row gutter={[16, 16]} style={{ maxHeight: 420, overflowY: "auto" }}>
                    {combos
                        .filter((c) =>
                            c.name.toLowerCase().includes(comboSearch.toLowerCase())
                        )
                        .map((c) => (
                            <Col key={c.id} span={6} style={{ display: "flex" }}>
                                {renderCard(c, "combo")}
                            </Col>
                        ))}
                </Row>
            </TabPane>
        </Tabs>
    );
};

export default ClientFoodComboTab;
