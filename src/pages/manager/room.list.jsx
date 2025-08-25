import RoomModal from "@/components/room/room.create";
import RoomTable from "@/components/room/room.table";
import { fetchAllRoomAPI, fetchAllRoomTypeAPI, findCinemaByIdAPI } from "@/services/api.service";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RoomListPage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataRoom, setDataRoom] = useState([]);
    const [cinemaDetails, setCinemaDetails] = useState(null);
    const [roomType, setRoomType] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        loadRoom();
        fetchCinema(id);
        loadRoomType();
    }, []);

    const loadRoomType = async () => {
        const res = await fetchAllRoomTypeAPI();
        if (res.data) {
            setRoomType(res.data);
        }
    }

    const loadRoom = async () => {
        const res = await fetchAllRoomAPI(id);
        if (res.data) {
            setDataRoom(res.data);
        }
    };

    const fetchCinema = async (id) => {
        const res = await findCinemaByIdAPI(id);
        if (res.data) {
            setCinemaDetails(res.data);
        }
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        fontSize: "1.5rem",
                        lineHeight: 1.4,
                        color: "#1a1a1a",
                        letterSpacing: "-0.5px"
                    }}
                >
                    {cinemaDetails ? cinemaDetails.name : "Loading..."}
                </h2>

                <Button type="primary" onClick={showModal}>
                    Create Room
                </Button>
            </div>
            <RoomTable
                dataRoom={dataRoom}
                loadRoom={loadRoom}
                roomType={roomType}
            />
            <RoomModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                loading={loading}
                setLoading={setLoading}
                loadRoom={loadRoom}
                roomType={roomType}
            />
        </>
    );
}

export default RoomListPage;