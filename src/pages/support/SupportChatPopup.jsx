import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Input, Button, Spin, message as antdMessage } from "antd";
import {
    SendOutlined,
    CloseOutlined,
    ReloadOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/chatbot.css";
import {
    getSupportMessagesAPI,
    sendSupportMessageAPI,
} from "@/services/api.service";

const { TextArea } = Input;

const SupportChatPopup = ({ session, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (session?.sessionId) {
            fetchMessages();
        }
    }, [session]);

    const fetchMessages = async () => {
        try {
            const res = await getSupportMessagesAPI(session.sessionId);
            setMessages(res.data || []);
        } catch {
            antdMessage.error("Không thể tải tin nhắn!");
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const newMsg = { sender: "AGENT", content: input };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
        setLoading(true);
        try {
            await sendSupportMessageAPI({
                sessionId: session.sessionId,
                content: input,
            });
        } catch {
            antdMessage.error("Không thể gửi tin nhắn!");
        } finally {
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <AnimatePresence>
            <motion.div
                className="chatbot-container"
                style={{ bottom: 20, right: 20 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
            >
                {/* Header */}
                <div
                    className="chatbot-header"
                    style={{
                        background: "linear-gradient(135deg, #1677ff, #0052d4)",
                    }}
                >
                    <div>
                        💬 Phiên #{session.sessionId} — {session.customerName}
                    </div>
                    <div className="actions" style={{ display: "flex", gap: 6 }}>
                        <Button
                            icon={<ReloadOutlined />}
                            type="text"
                            onClick={fetchMessages}
                        />
                        <Button
                            icon={<CloseOutlined />}
                            type="text"
                            onClick={onClose}
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="chatbot-body" ref={messagesContainerRef}>
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`chatbot-message ${msg.sender === "AGENT" ? "user" : "bot"
                                }`}
                        >
                            {msg.sender !== "AGENT" && (
                                <div
                                    className="bot-avatar"
                                    style={{ backgroundColor: "#1677ff" }}
                                >
                                    💬
                                </div>
                            )}
                            <div
                                className={`chat-bubble ${msg.sender === "AGENT" ? "user" : "bot"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="chatbot-message bot">
                            <div
                                className="bot-avatar"
                                style={{ backgroundColor: "#1677ff" }}
                            >
                                💬
                            </div>
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
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Nhập tin nhắn..."
                        autoSize={{ minRows: 1, maxRows: 3 }}
                        style={{ flex: 1, borderRadius: 12 }}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        shape="circle"
                        onClick={handleSend}
                        disabled={loading}
                        style={{ backgroundColor: "#1677ff", borderColor: "#1677ff" }}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SupportChatPopup;