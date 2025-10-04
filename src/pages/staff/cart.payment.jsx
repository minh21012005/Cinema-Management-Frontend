import { Card, Divider, Input, Button, Typography } from "antd";

const { Text } = Typography;

const CartPayment = ({
    selectedSeats,
    seatLayouts,
    foods,
    combos,
    cartFood,
    totalPrice,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    ticketPrice,
    handleBooking,
}) => (
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
            .map(([key, qty]) => {
                const [type, id] = key.split("-");
                const item =
                    type === "food"
                        ? foods.find((f) => f.id === Number(id))
                        : combos.find((c) => c.id === Number(id));
                return (
                    <div key={key}>
                        {item?.name} x {qty} = {item?.price * qty}k
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
            onClick={handleBooking}
        >
            Confirm & Pay
        </Button>
    </Card>
);

export default CartPayment;
