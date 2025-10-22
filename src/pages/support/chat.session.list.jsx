import { useState, useEffect, useRef } from "react";
import { Table, Button, Tag, Space, message, Tabs } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
    getSupportSessionsAPI,
    assignSupportSessionAPI,
} from "@/services/api.service";
import SupportChatPopup from "./SupportChatPopup";

const ChatSessionListPage = () => {
    const token = window.localStorage.getItem("access_token");
    const baseWebSocketUrl = import.meta.env.VITE_BACKEND_WEBSOCKET_CHAT_URL;
    const socketUrl = `${baseWebSocketUrl}/ws?accessToken=${token}`;

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("OPEN");
    const [activeSession, setActiveSession] = useState(null);
    const [stompClient, setStompClient] = useState(null);

    const stompClientRef = useRef(null);

    useEffect(() => {
        fetchSessions();
        connectWebSocket();
        return () => disconnectWebSocket();
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

    // 🧠 Kết nối WebSocket
    const connectWebSocket = () => {
        const socket = new SockJS(socketUrl);
        const client = Stomp.over(socket);
        stompClientRef.current = client;

        client.connect({}, () => {
            client.subscribe("/topic/support-sessions", (msg) => {
                const newSession = JSON.parse(msg.body);
                // ✅ Chỉ thêm nếu đang ở tab OPEN
                if (activeTab === "OPEN") {
                    setSessions((prev) => {
                        const exists = prev.some(s => s.sessionId === newSession.sessionId);
                        return exists ? prev : [newSession, ...prev];
                    });
                    message.info(`🆕 Có khách hàng mới mở phiên hỗ trợ!`);
                }
            });

            client.subscribe("/topic/support-session-updates", (msg) => {
                const updatedSession = JSON.parse(msg.body);

                setSessions((prev) => {
                    const exists = prev.find(s => s.sessionId === updatedSession.sessionId);
                    if (!exists) return prev; // không có thì thôi

                    // Nếu đang ở tab OPEN thì loại bỏ những phiên đã được assigned
                    if (activeTab === "OPEN" && updatedSession.status !== "OPEN") {
                        return prev.filter(s => s.sessionId !== updatedSession.sessionId);
                    }

                    // Nếu đang ở tab ASSIGNED thì cập nhật hoặc thêm mới
                    if (activeTab === "ASSIGNED" && updatedSession.status === "ASSIGNED") {
                        const filtered = prev.filter(s => s.sessionId !== updatedSession.sessionId);
                        return [updatedSession, ...filtered];
                    }

                    // Nếu đang ở tab CLOSED thì tương tự
                    if (activeTab === "CLOSED" && updatedSession.status === "CLOSED") {
                        const filtered = prev.filter(s => s.sessionId !== updatedSession.sessionId);
                        return [updatedSession, ...filtered];
                    }

                    return prev;
                });

                // Thông báo nhẹ
                message.info(`📢 Phiên #${updatedSession.sessionId} đã được ${updatedSession.status === "ASSIGNED" ? "tiếp nhận" : "cập nhật"}!`);
            });
        });
    };

    const disconnectWebSocket = () => {
        if (stompClientRef.current) {
            stompClientRef.current.disconnect();
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

    const handleOpenChat = (session) => setActiveSession(session);
    const handleCloseChat = () => setActiveSession(null);

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
                            onClick={() => handleOpenChat(record)}
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

            {activeSession && (
                <SupportChatPopup session={activeSession} onClose={handleCloseChat} />
            )}
        </div>
    );
};

export default ChatSessionListPage;