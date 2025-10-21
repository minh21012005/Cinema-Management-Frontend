import { useState, useEffect } from "react";
import { Table, Button, Tag, Space, message, Tabs } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import {
    getSupportSessionsAPI,
    assignSupportSessionAPI,
} from "@/services/api.service";
import SupportChatPopup from "./SupportChatPopup"; // 👈 thêm component popup riêng

const ChatSessionListPage = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("OPEN");
    const [activeSession, setActiveSession] = useState(null); // 👈 phiên đang mở chat

    useEffect(() => {
        fetchSessions();
    }, [activeTab]);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const res = await getSupportSessionsAPI({ status: activeTab });
            setSessions(res.data || []);
        } catch {
            message.error("Không thể tải danh sách phiên!");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (sessionId) => {
        try {
            await assignSupportSessionAPI(sessionId);
            message.success("Đã tiếp nhận phiên hỗ trợ!");
            fetchSessions();
        } catch {
            message.error("Không thể tiếp nhận phiên!");
        }
    };

    const handleOpenChat = (session) => {
        setActiveSession(session); // 👈 mở popup chat trong cùng trang
    };

    const handleCloseChat = () => {
        setActiveSession(null);
    };

    const columns = [
        { title: "Mã phiên", dataIndex: "sessionId", key: "sessionId" },
        { title: "Khách hàng", dataIndex: "customerName", key: "customerName" },
        { title: "Tin nhắn cuối", dataIndex: "lastMessage", key: "lastMessage" },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text) => {
                switch (text) {
                    case "OPEN": return <Tag color="orange">Chưa tiếp nhận</Tag>;
                    case "ASSIGNED": return <Tag color="green">Đang hỗ trợ</Tag>;
                    case "CLOSED": return <Tag color="gray">Đã kết thúc</Tag>;
                    default: return text;
                }
            },
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Space>
                    {record.status === "OPEN" && (
                        <Button
                            icon={<MessageOutlined />}
                            type="primary"
                            size="small"
                            onClick={() => handleAssign(record.sessionId)}
                        >
                            Tiếp nhận
                        </Button>
                    )}
                    {record.status === "ASSIGNED" && (
                        <Button
                            icon={<MessageOutlined />}
                            size="small"
                            onClick={() => handleOpenChat(record)} // 👈 mở khung chat
                        >
                            Mở chat
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ position: "relative" }}>
            <h2 style={{ marginBottom: 16 }}>💬 Quản lý phiên hỗ trợ</h2>
            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
                items={[
                    { key: "OPEN", label: "Đang chờ xử lý" },
                    { key: "ASSIGNED", label: "Đang hỗ trợ" },
                    { key: "CLOSED", label: "Đã kết thúc" },
                ]}
            />
            <Table
                columns={columns}
                dataSource={sessions}
                rowKey="sessionId"
                loading={loading}
                bordered
                pagination={false}
            />

            {/* Popup chat nổi */}
            {activeSession && (
                <SupportChatPopup
                    session={activeSession}
                    onClose={handleCloseChat}
                />
            )}
        </div>
    );
};

export default ChatSessionListPage;