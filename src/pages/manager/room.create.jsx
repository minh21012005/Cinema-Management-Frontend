// SeatLayoutAdmin.jsx
import { useState, useEffect, useRef } from "react";
import { Form, message, notification } from "antd";
import { createRoomAPI, fetchAllRoomTypeAPI, fetchAllSeatTypeAPI } from "@/services/api.service";
import SeatCanvas from "@/components/seat/seat.canvas";
import { useNavigate, useParams } from "react-router-dom";
import RoomForm from "@/components/room/room.form";

const RoomCreate = () => {
    const [form] = Form.useForm();
    const [roomTypes, setRoomTypes] = useState([]);
    const [seatTypes, setSeatTypes] = useState({});
    const [seats, setSeats] = useState([]);
    const autoId = useRef(1);
    const { id } = useParams();
    const nav = useNavigate();

    useEffect(() => {
        fetchSeatTypes();
        fetchAllRoomTypeAPI().then((res) => res?.data && setRoomTypes(res.data));
    }, []);

    useEffect(() => {
        if (Object.values(seatTypes).length > 0) {
            form.setFieldsValue({ seatType: Object.values(seatTypes)[0].id });
        }
    }, [seatTypes]);

    const fetchSeatTypes = async () => {
        const res = await fetchAllSeatTypeAPI();
        const data = res.data || [];

        const colors = ["#ffffff", "#fff7e6", "#fff0f6", "#f6ffed"];
        const strokes = ["#8c8c8c", "#fa8c16", "#d46b08", "#52c41a"];

        const formatted = {};
        data.forEach((s, index) => {
            formatted[s.id] = {
                id: s.id,
                label: s.name,
                priceExtra: s.priceExtra,
                fill: colors[index] || "#f0f0f0",
                stroke: strokes[index] || "#000000",
            };
        });

        setSeatTypes(formatted);
    };

    const rows = Form.useWatch("rows", form) || 6;
    const cols = Form.useWatch("cols", form) || 10;
    const selectedType = Form.useWatch("seatType", form) || Object.keys(seatTypes)[0];

    const toggleSeatAt = (r, c) => {
        const covered = seats.find((s) => s.row === r && c >= s.col && c < s.col + s.span);
        if (covered) {
            setSeats((prev) => prev.filter((s) => s.id !== covered.id));
            return;
        }

        const span = seatTypes[selectedType]?.label === "Đôi" ? 2 : 1;
        if (c + span > cols || seats.some((s) => s.row === r && c < s.col + s.span && c + span > s.col)) {
            message.warning(span === 2 ? "Ghế đôi cần 2 ô trống liền kề." : "Ô này đã có ghế.");
            return;
        }

        setSeats((prev) => [...prev, { id: autoId.current++, row: r, col: c, type: selectedType, span }]);
    };

    const handleSave = async (values) => {
        if (seats.length === 0) {
            message.warning("Vui lòng thêm ghế vào phòng.");
            return;
        }
        const payload = seats.map((s) => ({
            row: s.row,
            col: s.col,
            type: s.type,
            name: `${String.fromCharCode(65 + s.row)}${s.col + 1}${s.span === 2 ? `-${s.col + 2}` : ""}`,
        }));
        const res = await createRoomAPI(id, values.name, values.roomType, payload);
        if (res.data) {
            notification.success({
                message: "Tạo phòng thành công",
                description: `Phòng "${values.name}" đã được tạo.`,
            });
            form.resetFields();
            setSeats([]);
            nav(`/manager/cinemas/${id}/rooms`);
        } else {
            notification.error({
                message: "Tạo phòng thất bại",
                description: JSON.stringify(res.message) || "Đã có lỗi xảy ra.",
            });
        }
    };

    return (
        <div style={{ display: "flex", height: "100%" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        width: "50vw",                       // độ rộng vừa phải
                        margin: "0 auto",                 // căn giữa
                        padding: "6px 0",                 // thu nhỏ chiều cao
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: 14,                     // chữ nhỏ hơn, gọn gàng
                        color: "#001529",
                        background: "#f5f5f5",           // màu nền nhẹ
                        borderBottom: "2px solid #d9d9d9",
                        borderBottomLeftRadius: 8,        // bo góc dưới trái
                        borderBottomRightRadius: 8,       // bo góc dưới phải
                        marginBottom: 12,
                    }}
                >
                    Màn hình
                </div>

                <SeatCanvas rows={rows} cols={cols} seats={seats} onToggleSeat={toggleSeatAt} seatTypes={seatTypes} />

                <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 20, fontSize: 13 }}>
                    {Object.values(seatTypes).map((v) => (
                        <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: v.label === "Đôi" ? 40 : 20, height: 14, background: v.fill, border: `2px solid ${v.stroke}`, borderRadius: 6 }} />
                            {v.label}
                        </div>
                    ))}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 20, height: 14, border: `1px dashed #f0f0f0`, borderRadius: 6 }} />
                        Trống
                    </div>
                </div>
            </div>

            <div style={{ width: "15vw", padding: 16, borderLeft: "1px solid #eee", background: "#fafafa" }}>
                <h3>Thiết lập phòng</h3>
                <RoomForm
                    form={form}
                    roomTypes={roomTypes}
                    seatTypes={seatTypes}
                    onSave={handleSave}
                    onClear={() => setSeats([])}
                />
            </div>
        </div>
    );
};

export default RoomCreate;
