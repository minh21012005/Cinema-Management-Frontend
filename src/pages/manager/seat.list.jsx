import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Tag } from "antd";
import instance from "@/services/axios.customize"; // axios instance của bạn

const SeatListPage = () => {
    const { id } = useParams(); // roomId
    const [seats, setSeats] = useState([]);

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const res = await instance.get(`/api/v1/rooms/${id}/seats`);
                setSeats(res.data);
            } catch (err) {
                console.error("Error loading seats:", err);
            }
        };
        fetchSeats();
    }, [id]);

    // Tạo grid: group theo row (A, B, C...)
    const rows = {};
    seats.forEach(seat => {
        const row = seat.name.charAt(0); // A
        if (!rows[row]) rows[row] = [];
        rows[row].push(seat);
    });

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Seats in Room {id}</h2>
            <div className="space-y-4">
                {Object.keys(rows).map(row => (
                    <div key={row} className="flex gap-2 items-center">
                        <span className="w-6 font-bold">{row}</span>
                        <div className="grid grid-cols-12 gap-2">
                            {rows[row].map(seat => (
                                <Card
                                    key={seat.id}
                                    className={`w-12 h-12 flex items-center justify-center cursor-pointer 
                    ${seat.active ? "bg-green-100" : "bg-gray-300"}`}
                                    size="small"
                                >
                                    <span className="text-sm">{seat.name}</span>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeatListPage;
