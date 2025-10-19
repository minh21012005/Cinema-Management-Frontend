import React, { useEffect, useState, useRef, useContext, useLayoutEffect } from "react";
import { Input, Button, Spin, FloatButton, message as antdMessage } from "antd";
import { SendOutlined, RobotOutlined, MessageOutlined, CloseOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/chatbot.css";
import { chatBotAPI, fetchChatBotHistory, fetchChatBotHistoryForUser, resetChatBotSession } from "@/services/api.service";

const { TextArea } = Input;

const ChatBotComponent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [sessionId, setSessionId] = useState(null); // 🌟 Quản lý session
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) setUserId(storedUserId);

        const welcomeMsg = { sender: "BOT", content: "Xin chào! Tôi là CNM Assistant 🤖" };
        setMessages([welcomeMsg]);
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages]);

    useLayoutEffect(() => {
        if (open && messagesContainerRef.current) {
            const container = messagesContainerRef.current;

            // Chờ frame đầu tiên để đảm bảo layout tin nhắn đã render xong
            requestAnimationFrame(() => {
                container.scrollTop = container.scrollHeight;
            });
        }
    }, [open, messages]);

    useEffect(() => {
        const savedSession = localStorage.getItem("chatSessionId");
        setSessionId(savedSession);

        const loadHistory = async () => {
            try {
                let res;
                if (userId) {
                    res = await fetchChatBotHistoryForUser(userId);
                } else if (savedSession) {
                    res = await fetchChatBotHistory(savedSession);
                }

                // Cập nhật messages: nếu có dữ liệu từ backend thì dùng, nếu không thì tin nhắn mặc định
                setMessages(
                    res?.data?.length
                        ? res.data
                        : [{ sender: "BOT", content: "Xin chào! Tôi là CNM Assistant, bạn cần tôi hỗ trợ gì? 🤖" }]
                );
            } catch (err) {
                console.error("Load chat history failed:", err);
                setMessages([{ sender: "BOT", content: "Xin chào! Tôi là CNM Assistant 🤖" }]);
            }
        };

        loadHistory();
    }, [userId]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "USER", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            // Tạo payload gửi lên backend
            const payload = { content: input };
            if (sessionId) payload.sessionId = sessionId; // gửi sessionId nếu có

            // Gọi API với payload
            const res = await chatBotAPI(payload);

            const botReply = {
                sender: res.data.sender,
                content: res.data.content,
            };

            setMessages(prev => [...prev, botReply]);

            // Lưu sessionId lần đầu để các tin nhắn tiếp theo dùng chung
            if (!sessionId && res.data.sessionId) {
                setSessionId(res.data.sessionId);
                localStorage.setItem("chatSessionId", res.data.sessionId);
            }

        } catch (err) {
            antdMessage.error(res?.message || "Không thể gửi tin nhắn, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleWheel = (e) => {
        const target = e.currentTarget;
        const atTop = target.scrollTop === 0 && e.deltaY < 0;
        const atBottom =
            target.scrollHeight - target.scrollTop === target.clientHeight &&
            e.deltaY > 0;
        if (atTop || atBottom) e.preventDefault();
    };

    const handleResetSession = async () => {
        try {
            await resetChatBotSession();
            localStorage.removeItem("chatSessionId"); // Xoá session hiện tại
            setSessionId(null);
            setMessages([
                { sender: "BOT", content: "Bắt đầu cuộc trò chuyện mới 🤖" },
            ]);
            antdMessage.success("Đã bắt đầu cuộc trò chuyện mới!");
        } catch (err) {
            console.error("Reset session failed:", err);
            antdMessage.error("Không thể reset cuộc trò chuyện!");
        }
    };

    return (
        <>
            {!open && (
                <FloatButton
                    icon={<MessageOutlined />}
                    tooltip="Trò chuyện với CNM Cinemas"
                    type="primary"
                    shape="circle"
                    style={{ right: 24, bottom: 24, boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}
                    onClick={() => setOpen(true)}
                />
            )}

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                            position: "fixed",
                            bottom: 20,
                            right: 24,
                            width: 380,
                            height: 520,
                            zIndex: 9999,
                            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                            borderRadius: 12,
                            overflow: "hidden",
                            background: "#fff",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "12px",
                                borderBottom: "1px solid #f0f0f0",
                                background: "#fff",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <RobotOutlined /> CNM Cinemas Assistant
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                                <Button type="text" onClick={handleResetSession}>
                                    New Chat
                                </Button>
                                <Button type="text" onClick={() => setOpen(false)}>
                                    <CloseOutlined />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            className="chat-container"
                            ref={messagesContainerRef}
                            onWheel={handleWheel}
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                padding: "12px",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: msg.sender === "USER" ? "flex-end" : "flex-start",
                                        marginBottom: 8,
                                        alignItems: "flex-end",
                                    }}
                                >
                                    {msg.sender === "BOT" && (
                                        <div
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: "50%",
                                                backgroundColor: "#1677ff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#fff",
                                                fontSize: 18,
                                                marginRight: 8,
                                                flexShrink: 0,
                                            }}
                                        >
                                            🤖
                                        </div>
                                    )}

                                    <div
                                        style={{
                                            background: msg.sender === "USER" ? "#1677ff" : "#f1f1f1",
                                            color: msg.sender === "USER" ? "#fff" : "#000",
                                            padding: "8px 12px",
                                            borderRadius: 16,
                                            maxWidth: "75%",
                                            whiteSpace: "pre-wrap",
                                            lineHeight: 1.4,
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                            transformOrigin: msg.sender === "USER" ? "100% 0%" : "0% 0%",
                                        }}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: "50%",
                                            backgroundColor: "#1677ff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#fff",
                                            fontSize: 18,
                                            marginRight: 8,
                                            flexShrink: 0,
                                        }}
                                    >
                                        🤖
                                    </div>
                                    <Spin size="small" />
                                </div>
                            )}
                            <div style={{ height: 20 }} />
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div
                            style={{
                                borderTop: "1px solid #f0f0f0",
                                padding: "10px 12px",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <TextArea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Nhập tin nhắn..."
                                autoSize={{ minRows: 1, maxRows: 3 }}
                                style={{ flex: 1, resize: "none", borderRadius: 8 }}
                            />
                            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} disabled={loading} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBotComponent;
