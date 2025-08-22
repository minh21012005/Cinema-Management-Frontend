import RoomTable from "@/components/room/room.table";
import { Button, Space } from "antd";
import Search from "antd/es/transfer/search";
import { useState } from "react";

const RoomListPage = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const onSearch = (value) => {
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
                <div style={{ display: "flex", justifyContent: "space-between", width: "350px" }}>
                    <Space direction="vertical">
                        <Search
                            placeholder="Nhập tên phòng..."
                            allowClear
                            onSearch={onSearch}
                            style={{ width: 200 }}
                        />
                    </Space>
                </div>

                <Button type="primary" onClick={showModal}>
                    Create Room
                </Button>
            </div>
            <RoomTable />
        </>
    );
}

export default RoomListPage;