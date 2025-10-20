import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Input, Button, Spin, FloatButton, message as antdMessage } from "antd";
import { SendOutlined, CustomerServiceOutlined, CloseOutlined, ReloadOutlined, MessageOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/chatbot.css";

const { TextArea } = Input;

const CustomerSupportChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [userId, setUserId] = useState(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // ⏳ Lấy userId và khởi tạo lời chào
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) setUserId(storedUserId);
        setMessages([{ sender: "AGENT", content: "Xin chào 👋 Bộ phận CSKH có thể giúp gì cho bạn hôm nay?" }]);
    }, []);

    // 🔄 Cuộn xuống khi có tin mới
    useLayoutEffect(() => {
        if (open && messagesContainerRef.current) {
            requestAnimationFrame(() => {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            });
        }
    }, [open, messages]);

    // 🗄️ Load lịch sử tin nhắn khi mở
    useEffect(() => {
        const savedSession = localStorage.getItem("supportSessionId");
        setSessionId(savedSession);

        const loadHistory = async () => {
            try {
                let res;
                if (savedSession) res = await fetchSupportHistoryAPI(savedSession);
                if (res?.data?.length) {
                    setMessages(res.data);
                } else {
                    setMessages([{ sender: "AGENT", content: "Xin chào 👋 Bộ phận CSKH có thể giúp gì cho bạn hôm nay?" }]);
                }
            } catch {
                setMessages([{ sender: "AGENT", content: "Xin chào 👋 Bộ phận CSKH có thể giúp gì cho bạn hôm nay?" }]);
            }
        };
        if (savedSession) loadHistory();
    }, []);

    // ✉️ Gửi tin nhắn
    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { sender: "USER", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            let currentSession = sessionId;

            // Nếu chưa có session thì tạo mới
            if (!currentSession) {
                const sessionRes = await createSupportSessionAPI({ userId });
                currentSession = sessionRes.data.sessionId;
                setSessionId(currentSession);
                localStorage.setItem("supportSessionId", currentSession);
            }

            // Gửi tin nhắn
            const payload = { content: input, sessionId: currentSession };
            await createSupportMessageAPI(payload);

            // Giả lập phản hồi tạm (nếu backend xử lý async)
            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    { sender: "AGENT", content: "Cảm ơn bạn, CSKH sẽ phản hồi trong ít phút!" },
                ]);
                setLoading(false);
            }, 1000);
        } catch {
            antdMessage.error("Không thể gửi tin nhắn, vui lòng thử lại!");
            setLoading(false);
        }
    };

    // ⌨️ Gửi khi Enter
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // 🔁 Reset session
    const handleResetSession = async () => {
        try {
            await resetSupportSessionAPI(sessionId);
            localStorage.removeItem("supportSessionId");
            setSessionId(null);
            setMessages([{ sender: "AGENT", content: "Bắt đầu cuộc trò chuyện mới với CSKH 🧑‍💼" }]);
            antdMessage.success("Đã bắt đầu cuộc trò chuyện mới!");
        } catch {
            antdMessage.error("Không thể reset cuộc trò chuyện!");
        }
    };

    return (
        <>
            {!open && (
                <FloatButton
                    icon={<CustomerServiceOutlined style={{ color: "#333" }} />}
                    tooltip="Liên hệ CSKH"
                    type="primary"
                    shape="circle"
                    className="support-float-btn"
                    style={{
                        right: 24,
                        bottom: 74, // nằm ngay trên chatbot
                        backgroundColor: "#fa8c16",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                    }}
                    onClick={() => setOpen(true)}
                />
            )}

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="chatbot-container"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Header */}
                        <div
                            className="chatbot-header"
                            style={{ background: "linear-gradient(135deg, #fa8c16, #d46b08)" }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <CustomerServiceOutlined /> CSKH Rạp CNM
                            </div>
                            <div className="actions" style={{ display: "flex", gap: 6 }}>
                                <Button icon={<ReloadOutlined />} type="text" onClick={handleResetSession} />
                                <Button icon={<CloseOutlined />} type="text" onClick={() => setOpen(false)} />
                            </div>
                        </div>

                        {/* Body */}
                        <div className="chatbot-body" ref={messagesContainerRef}>
                            {messages.map((msg, i) => (
                                <div key={i} className={`chatbot-message ${msg.sender === "USER" ? "user" : "bot"}`}>
                                    {msg.sender === "AGENT" && (
                                        <div className="bot-avatar" style={{ backgroundColor: "#fa8c16" }}>
                                            🧑‍💼
                                        </div>
                                    )}
                                    <div className={`chat-bubble ${msg.sender === "USER" ? "user" : "bot"}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="chatbot-message bot">
                                    <div className="bot-avatar" style={{ backgroundColor: "#fa8c16" }}>🧑‍💼</div>
                                    <Spin size="small" />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="chatbot-input">
                            <TextArea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Nhập tin nhắn..."
                                autoSize={{ minRows: 1, maxRows: 3 }}
                                style={{ flex: 1, borderRadius: 12, resize: "none" }}
                            />
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                shape="circle"
                                onClick={handleSend}
                                disabled={loading}
                                style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CustomerSupportChat;
