import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Input, Button, Spin, FloatButton, message as antdMessage } from "antd";
import { SendOutlined, RobotOutlined, MessageOutlined, CloseOutlined, ReloadOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/chatbot.css";
import { chatBotAPI, fetchChatBotHistory, fetchChatBotHistoryForUser, resetChatBotSession } from "@/services/api.service";

const { TextArea } = Input;

const ChatBotComponent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [userId, setUserId] = useState(null);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) setUserId(storedUserId);
        setMessages([{ sender: "BOT", content: "Xin chào 👋 Tôi là CNM Assistant!" }]);
    }, []);

    useLayoutEffect(() => {
        if (open && messagesContainerRef.current) {
            requestAnimationFrame(() => {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            });
        }
    }, [open, messages]);

    useEffect(() => {
        const savedSession = localStorage.getItem("chatSessionId");
        setSessionId(savedSession);

        const loadHistory = async () => {
            try {
                let res;
                if (userId) res = await fetchChatBotHistoryForUser(userId);
                else if (savedSession) res = await fetchChatBotHistory(savedSession);
                setMessages(
                    res?.data?.length
                        ? res.data
                        : [{ sender: "BOT", content: "Xin chào 👋 Tôi là CNM Assistant!" }]
                );
            } catch {
                setMessages([{ sender: "BOT", content: "Xin chào 👋 Tôi là CNM Assistant!" }]);
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
            const payload = { content: input, sessionId };
            const res = await chatBotAPI(payload);
            const botReply = { sender: res.data.sender, content: res.data.content };
            setMessages(prev => [...prev, botReply]);
            if (!sessionId && res.data.sessionId) {
                setSessionId(res.data.sessionId);
                localStorage.setItem("chatSessionId", res.data.sessionId);
            }
        } catch {
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

    const handleResetSession = async () => {
        try {
            await resetChatBotSession();
            localStorage.removeItem("chatSessionId");
            setSessionId(null);
            setMessages([{ sender: "BOT", content: "Bắt đầu cuộc trò chuyện mới 🤖" }]);
            antdMessage.success("Đã bắt đầu cuộc trò chuyện mới!");
        } catch {
            antdMessage.error("Không thể reset cuộc trò chuyện!");
        }
    };

    return (
        <>
            {!open && (
                <FloatButton
                    icon={<MessageOutlined />}
                    tooltip="Trò chuyện với CNM Assistant"
                    type="primary"
                    shape="circle"
                    style={{ right: 24, bottom: 24, boxShadow: "0 4px 10px rgba(0,0,0,0.25)" }}
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
                        <div className="chatbot-header">
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <RobotOutlined /> CNM Assistant
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
                                    {msg.sender === "BOT" && <div className="bot-avatar">🤖</div>}
                                    <div className={`chat-bubble ${msg.sender === "USER" ? "user" : "bot"}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="chatbot-message bot">
                                    <div className="bot-avatar">🤖</div>
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
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBotComponent;
