import { Row, Col, Tabs, Input } from "antd";
import FoodCard from "./FoodCard";
import ComboCard from "./ComboCard";

const { TabPane } = Tabs;

const FoodComboTab = ({
    foods,
    combos,
    foodSearch,
    comboSearch,
    setFoodSearch,
    setComboSearch,
    cartFood,
    changeFoodQty,
}) => {
    return (
        <Tabs defaultActiveKey="food">
            <TabPane tab="Food" key="food">
                <Input
                    placeholder="Search Food"
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    style={{ marginBottom: 10 }}
                />
                <Row gutter={[16, 16]} style={{ maxHeight: 420, overflowY: "auto" }}>
                    {foods
                        .filter((f) => f.name.toLowerCase().includes(foodSearch.toLowerCase()))
                        .map((f) => (
                            <Col key={f.id} span={6}>
                                <FoodCard
                                    food={f}
                                    quantity={cartFood[`food-${f.id}`] || 0}
                                    onChangeQty={(id, qty) => changeFoodQty("food", id, qty)}
                                    style={{ flex: 1 }} // bắt Card fill Col
                                />
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
                <Row gutter={[16, 16]} style={{ maxHeight: 420, overflowY: "auto" }}>
                    {combos
                        .filter((c) => c.name.toLowerCase().includes(comboSearch.toLowerCase()))
                        .map((c) => (
                            // Đặt Col là flex để con (Card) stretch được
                            <Col key={c.id} span={6} style={{ display: "flex" }}>
                                <ComboCard
                                    combo={c}
                                    quantity={cartFood[`combo-${c.id}`] || 0}
                                    onChangeQty={(id, qty) => changeFoodQty("combo", id, qty)}
                                    style={{ flex: 1 }} // bắt Card fill Col
                                />
                            </Col>
                        ))}
                </Row>
            </TabPane>
        </Tabs>
    );
};

export default FoodComboTab;
