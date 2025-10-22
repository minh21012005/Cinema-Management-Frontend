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
    agentMarkAsReadAPI,
    getSupportMessagesAPI,
    sendSupportMessageAPI,
} from "@/services/api.service";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const { TextArea } = Input;

const SupportChatPopup = ({ session, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const stompClientRef = useRef(null);

    const token = window.localStorage.getItem("access_token");
    const baseWebSocketUrl = import.meta.env.VITE_BACKEND_WEBSOCKET_CHAT_URL;
    const socketUrl = `${baseWebSocketUrl}/ws?accessToken=${token}`;

    useEffect(() => {
        if (session?.sessionId) {
            fetchMessages();
            connectWebSocket();
        }

        return () => disconnectWebSocket();
    }, [session]);

    const connectWebSocket = () => {
        const socket = new SockJS(socketUrl);
        const client = Stomp.over(socket);
        stompClientRef.current = client;

        client.connect({}, () => {
            client.subscribe(`/topic/user/support-messages/${session.sessionId}`, (msg) => {
                const newMsg = JSON.parse(msg.body);
                setMessages((prev) => [...prev, newMsg]);
            });
        });
    };

    const disconnectWebSocket = () => {
        if (stompClientRef.current) {
            stompClientRef.current.disconnect();
        }
    };

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

    const markAsRead = async (sessionId) => {
        await agentMarkAsReadAPI(sessionId);
    }

    return (
        <AnimatePresence>
            <motion.div
                className="chatbot-container"
                style={{ bottom: 20, right: 20 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                onClick={() => {
                    markAsRead(session.sessionId);
                }}
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
                    {messages.map((msg, i) => {
                        const showAvatar =
                            msg.sender !== "AGENT" && (i === 0 || messages[i - 1].sender === "AGENT");

                        return (
                            <div
                                key={i}
                                className={`chatbot-message ${msg.sender === "AGENT" ? "user" : "bot"}`}
                            >
                                {showAvatar && (
                                    <div
                                        className="bot-avatar"
                                        style={{ backgroundColor: "#1677ff" }}
                                    >
                                        💬
                                    </div>
                                )}
                                <div
                                    style={{ fontSize: "15px", maxWidth: "65%" }}
                                    className={`chat-bubble ${msg.sender === "AGENT" ? "user" : "bot"}`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })}
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