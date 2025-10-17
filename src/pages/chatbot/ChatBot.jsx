import React, { useEffect, useState, useRef } from "react";
import { Input, Button, Spin, FloatButton, message as antdMessage } from "antd";
import { SendOutlined, RobotOutlined, CloseOutlined, MessageOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const ChatBotComponent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fakeMessages = [
            { sender: "BOT", content: "Xin chào! Tôi là CNM Assistant 🤖" },
            ...Array.from({ length: 15 }).map((_, i) => ({
                sender: i % 2 === 0 ? "USER" : "BOT",
                content:
                    i % 2 === 0
                        ? `Tin nhắn thử nghiệm số ${i + 1} từ người dùng để kiểm tra khả năng cuộn.`
                        : `Đây là phản hồi mẫu từ chatbot cho tin nhắn thứ ${i + 1}.`,
            })),
        ];
        setMessages(fakeMessages);
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { sender: "USER", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            await new Promise((r) => setTimeout(r, 800));
            const botReply = {
                sender: "BOT",
                content:
                    input.includes("phim")
                        ? "Hiện đang có 4 phim hot: Dune 2, Venom 3, Joker 2 và Kungfu Panda 4 🍿"
                        : "Cảm ơn bạn! Mình đang ghi nhận thông tin nhé 🤖",
            };
            setMessages((prev) => [...prev, botReply]);
        } catch (err) {
            antdMessage.error("Không thể gửi tin nhắn, vui lòng thử lại!");
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

    // Ngăn scroll trang ngoài khi scroll chat
    const handleWheel = (e) => {
        const target = e.currentTarget;
        const atTop = target.scrollTop === 0 && e.deltaY < 0;
        const atBottom =
            target.scrollHeight - target.scrollTop === target.clientHeight &&
            e.deltaY > 0;
        if (atTop || atBottom) {
            e.preventDefault();
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

            {open && (
                <div
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
                        <Button type="text" onClick={() => setOpen(false)}>
                            ❌
                        </Button>
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "12px",
                            display: "flex",
                            flexDirection: "column",
                        }}
                        onWheel={handleWheel}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent: msg.sender === "USER" ? "flex-end" : "flex-start",
                                    marginBottom: 8,
                                }}
                            >
                                <div
                                    style={{
                                        background: msg.sender === "USER" ? "#1677ff" : "#f1f1f1",
                                        color: msg.sender === "USER" ? "#fff" : "#000",
                                        padding: "8px 12px",
                                        borderRadius: 16,
                                        maxWidth: "75%",
                                        whiteSpace: "pre-wrap",
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && <Spin size="small" />}
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
                </div>
            )}
        </>
    );
};

export default ChatBotComponent;
