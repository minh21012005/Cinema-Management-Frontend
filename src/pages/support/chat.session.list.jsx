import { useState, useEffect, useRef } from "react";
import { Table, Button, Tag, Space, message, Tabs, Badge, Card } from "antd";
import {
    MessageOutlined,
    ClockCircleOutlined,
    CustomerServiceOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
    getSupportSessionsAPI,
    assignSupportSessionAPI,
    agentMarkAsReadAPI,
    agentCloseChatSessionAPI,
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

    const audioRef = useRef(new Audio("/ting.mp3"));
    const stompClientRef = useRef(null);
    const subscriptionsRef = useRef({});
    const lastPlayTimeRef = useRef(0);

    useEffect(() => {
        fetchSessions();
        connectWebSocket();
        return () => disconnectWebSocket();
    }, [activeTab]);

    useEffect(() => {
        if (!stompClientRef.current || !stompClientRef.current.connected) return;
        Object.values(subscriptionsRef.current).forEach(sub => sub.unsubscribe());
        subscriptionsRef.current = {};

        sessions
            .filter(s => s.status === "ASSIGNED")
            .forEach(session => {
                const topic = `/topic/user/support-messages/${session.sessionId}`;
                const sub = stompClientRef.current.subscribe(topic, (msg) => {
                    const messageData = JSON.parse(msg.body);
                    const { sessionId, content } = messageData;
                    const isActive = activeSession?.sessionId === sessionId;

                    const now = Date.now();
                    const timeSinceLastPlay = now - lastPlayTimeRef.current;

                    setSessions(prev => prev.map(s => {
                        if (s.sessionId !== sessionId) return s;
                        return {
                            ...s,
                            lastMessage: content,
                            unreadCountForAgent: isActive ? 0 : (s.unreadCountForAgent || 0) + 1,
                        };
                    }));

                    if (!isActive) {
                        // Không phải phiên đang mở → luôn kêu
                        audioRef.current.play().catch(() => { });
                        lastPlayTimeRef.current = now;
                    } else if (timeSinceLastPlay > 3000) {
                        // Đúng phiên đang mở → chỉ kêu nếu >3s từ lần cuối
                        audioRef.current.play().catch(() => { });
                        lastPlayTimeRef.current = now;
                    }
                });
                subscriptionsRef.current[session.sessionId] = sub;
            });

        sessions
            .filter(s => s.status === "ASSIGNED")
            .forEach(session => {
                const topic = `/topic/user/close/support-sessions/${session.sessionId}`;
                const sub = stompClientRef.current.subscribe(topic, (msg) => {
                    const { sessionId, status } = JSON.parse(msg.body);
                    if (status === "CLOSED") {
                        message.warning(`👋 Khách hàng đã kết thúc phiên ${sessionId}.`);
                        if (activeSession?.sessionId === sessionId) {
                            setActiveSession(null);
                        }
                        fetchSessions();
                    }
                });
                subscriptionsRef.current[session.sessionId] = sub;
            });
    }, [sessions, activeSession]);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const res = await getSupportSessionsAPI({ status: activeTab });
            const data = (res.data || []).map(s => ({
                ...s,
                unreadCountForAgent: s.unreadCountForAgent || 0
            }));
            setSessions(data);
        } catch {
            message.error("Không thể tải danh sách phiên!");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (sessionId) => {
        await agentMarkAsReadAPI(sessionId);
    }

    const handleCloseSession = async (sessionId) => {
        try {
            await agentCloseChatSessionAPI(sessionId);
            message.success("Phiên đã được kết thúc!");
            fetchSessions();
        } catch {
            message.error("Không thể kết thúc phiên!");
        }
    };

    const connectWebSocket = () => {
        const socket = new SockJS(socketUrl);
        const client = Stomp.over(socket);
        stompClientRef.current = client;

        client.connect({}, () => {
            client.subscribe("/topic/support-sessions", (msg) => {
                const newSession = JSON.parse(msg.body);
                if (activeTab === "OPEN") {
                    setSessions((prev) => {
                        const exists = prev.some(s => s.sessionId === newSession.sessionId);
                        return exists ? prev : [newSession, ...prev];
                    });
                }
                message.info(`🆕 Có khách hàng mới mở phiên hỗ trợ!`);
            });

            client.subscribe("/topic/support-session-updates", (msg) => {
                const updatedSession = JSON.parse(msg.body);
                setSessions((prev) => {
                    const exists = prev.find(s => s.sessionId === updatedSession.sessionId);
                    if (!exists) return prev;

                    if (activeTab === "OPEN" && updatedSession.status !== "OPEN") {
                        return prev.filter(s => s.sessionId !== updatedSession.sessionId);
                    }

                    if (activeTab === "ASSIGNED" && updatedSession.status === "ASSIGNED") {
                        const filtered = prev.filter(s => s.sessionId !== updatedSession.sessionId);
                        return [{ ...updatedSession, unreadCountForAgent: 0 }, ...filtered];
                    }

                    if (activeTab === "CLOSED" && updatedSession.status === "CLOSED") {
                        const filtered = prev.filter(s => s.sessionId !== updatedSession.sessionId);
                        return [{ ...updatedSession, unreadCountForAgent: 0 }, ...filtered];
                    }

                    return prev;
                });
                message.info(`📢 Phiên #${updatedSession.sessionId} đã được cập nhật!`);
            });
        });
    };

    const disconnectWebSocket = () => {
        if (stompClientRef.current) {
            Object.values(subscriptionsRef.current).forEach(sub => sub.unsubscribe());
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

    const handleOpenChat = (session) => {
        setActiveSession(session);
        markAsRead(session.sessionId);
        setSessions(prev => prev.map(s =>
            s.sessionId === session.sessionId ? { ...s, unreadCountForAgent: 0 } : s
        ));
    };

    const handleCloseChat = () => setActiveSession(null);

    const columns = [
        { title: "Mã phiên", dataIndex: "sessionId", key: "sessionId" },
        { title: "Khách hàng", dataIndex: "customerName", key: "customerName" },
        {
            title: "Tin nhắn cuối",
            dataIndex: "lastMessage",
            key: "lastMessage",
            ellipsis: true,
            render: (text) => text || <i style={{ color: "#999" }}>Chưa có tin nhắn</i>
        },
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
                            icon={<CustomerServiceOutlined />}
                            type="primary"
                            size="small"
                            onClick={() => handleAssign(record.sessionId)}
                            style={{ background: "linear-gradient(90deg, #fa8c16, #d46b08)", border: "none" }}
                        >
                            Tiếp nhận
                        </Button>
                    )}
                    {(record.status === "ASSIGNED" || record.status === "CLOSED") && (
                        <Space style={{ gap: 25 }}>
                            <Badge count={record.unreadCountForAgent} color="red" offset={[2, -2]}>
                                <Button
                                    icon={<MessageOutlined />}
                                    size="small"
                                    onClick={() => handleOpenChat(record)}
                                    style={{ backgroundColor: "#1890ff", color: "#fff", border: "none" }}
                                >
                                    Mở chat
                                </Button>
                            </Badge>
                            {record.status === "ASSIGNED" && (
                                <Button
                                    danger
                                    size="small"
                                    onClick={() => handleCloseSession(record.sessionId)}
                                >
                                    Kết thúc
                                </Button>
                            )}
                        </Space>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ margin: "-20px" }}>
            <Card
                title={<><CustomerServiceOutlined /> Quản lý phiên hỗ trợ khách hàng</>}
                style={{
                    border: "none",
                    boxShadow: "none",
                    background: "transparent"
                }}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        { key: "OPEN", label: <><ClockCircleOutlined /> Đang chờ xử lý</> },
                        { key: "ASSIGNED", label: <><MessageOutlined /> Đang hỗ trợ</> },
                        { key: "CLOSED", label: <><CheckCircleOutlined /> Đã kết thúc</> },
                    ]}
                />
                <Table
                    columns={columns}
                    dataSource={sessions}
                    rowKey="sessionId"
                    loading={loading}
                    bordered
                    pagination={{ pageSize: 10 }}
                    style={{
                        background: "white",
                        borderRadius: 12,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                />
            </Card>

            {activeSession && (
                <SupportChatPopup
                    session={activeSession}
                    onClose={handleCloseChat}
                    isReadOnly={activeSession.status === "CLOSED"}
                />
            )}
        </div>
    );
};

export default ChatSessionListPage;