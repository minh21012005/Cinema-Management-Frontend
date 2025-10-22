import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Input, Button, Spin, FloatButton, message as antdMessage, Badge } from "antd";
import { SendOutlined, CustomerServiceOutlined, CloseOutlined, ReloadOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/chatbot.css";
import { createSupportMessageAPI, fetchSupportHistoryAPI, userMarkAsReadAPI } from "@/services/api.service";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const { TextArea } = Input;

const CustomerSupportChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [connected, setConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const audioRef = useRef(new Audio("/ting.mp3"));

    const lastPlayRef = useRef(0);
    const openRef = useRef(open);
    useEffect(() => {
        openRef.current = open;
    }, [open]);

    const messagesContainerRef = useRef(null);
    const stompClientRef = useRef(null);

    const token = window.localStorage.getItem("access_token");
    const baseWebSocketUrl = import.meta.env.VITE_BACKEND_WEBSOCKET_CHAT_URL;
    const socketUrl = `${baseWebSocketUrl}/ws?accessToken=${token}`;

    // 1️⃣ Kết nối WebSocket một lần
    useEffect(() => {
        const socket = new SockJS(socketUrl);
        const client = Stomp.over(socket);
        client.debug = null; // tắt log thừa
        stompClientRef.current = client;

        client.connect(
            {},
            () => {
                console.log("✅ Connected to WebSocket");
                setConnected(true);
            },
            (error) => {
                console.error("❌ WebSocket error:", error);
                setConnected(false);
            }
        );

        return () => {
            if (client.connected) {
                client.disconnect(() => console.log("🔌 Disconnected"));
            }
        };
    }, []);

    // 2️⃣ Khi đã connected và có sessionId thì subscribe
    useEffect(() => {
        if (!connected || !sessionId) return;
        const client = stompClientRef.current;
        if (!client || !client.connected) return;

        console.log("🧩 Subscribing to:", `/topic/agent/support-messages/${sessionId}`);
        const sub = client.subscribe(`/topic/agent/support-messages/${sessionId}`, (msg) => {
            const newMsg = JSON.parse(msg.body);
            setMessages((prev) => [...prev, newMsg]);

            if (newMsg.sender === "AGENT") {
                const now = Date.now();
                // Nếu chatbox đóng hoặc đã hơn 2s từ lần phát trước, phát âm thanh
                if (!openRef.current || now - lastPlayRef.current > 2000) {
                    audioRef.current.play().catch(() => { });
                    lastPlayRef.current = now;
                }
                // Nếu chatbox đóng thì tăng unreadCount
                if (!openRef.current) {
                    setUnreadCount(prev => prev + 1);
                }
            }

        });

        return () => sub.unsubscribe();
    }, [connected, sessionId]);

    // 🗄️ Load lịch sử tin nhắn khi mở
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const res = await fetchSupportHistoryAPI();
                if (res?.data?.length) {
                    setMessages(res.data);
                    setSessionId(res.data[0].sessionId);

                    const unread = res.data.filter(
                        msg => msg.sender === "AGENT" && msg.readAt === null
                    ).length;
                    setUnreadCount(unread);
                } else {
                    setMessages([{ sender: "AGENT", content: "Xin chào 👋 Bộ phận CSKH có thể giúp gì cho bạn hôm nay?" }]);
                }
            } catch {
                setMessages([{ sender: "AGENT", content: "Xin chào 👋 Bộ phận CSKH có thể giúp gì cho bạn hôm nay?" }]);
            }
        };
        loadHistory();
    }, []);

    // 🔄 Cuộn xuống khi có tin mới
    useLayoutEffect(() => {
        if (open && messagesContainerRef.current) {
            requestAnimationFrame(() => {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            });
        }
    }, [open, messages]);

    // ✉️ Gửi tin nhắn
    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { sender: "USER", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const payload = { content: input };
            const resSend = await createSupportMessageAPI(payload);
            if (!resSend?.data) {
                antdMessage.error("Không thể gửi tin nhắn!");
                return;
            }
            if (!sessionId && resSend.data.sessionId) {
                setSessionId(resSend.data.sessionId);
            }
        } catch {
            antdMessage.error("Không thể gửi tin nhắn!");
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

    return (
        <>
            {!open && (
                <div style={{ position: "fixed", right: 24, bottom: 105, zIndex: 9999 }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                        <FloatButton
                            icon={<CustomerServiceOutlined style={{ color: "#333" }} />}
                            tooltip="Liên hệ CSKH"
                            type="primary"
                            shape="circle"
                            className="support-float-btn"
                            style={{
                                bottom: 74,
                                backgroundColor: "#fa8c16",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                                zIndex: 1,
                            }}
                            onClick={async () => {
                                setOpen(true);
                                setUnreadCount(0);
                                await userMarkAsReadAPI();
                            }}
                        />
                        {unreadCount > 0 && (
                            <div style={{
                                position: "absolute",
                                top: -10,
                                right: -6,
                                minWidth: 20,
                                height: 20,
                                backgroundColor: "#ff4d4f",
                                color: "white",
                                fontSize: 12,
                                fontWeight: 600,
                                borderRadius: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0 5px",
                                zIndex: 2,
                                boxShadow: "0 0 0 2px #fff",
                            }}>
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="chatbot-container"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        onClick={async () => {
                            await userMarkAsReadAPI();
                        }}
                    >
                        <div className="chatbot-header" style={{ background: "linear-gradient(135deg, #fa8c16, #d46b08)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <CustomerServiceOutlined /> CSKH Rạp CNM
                            </div>
                            <Button icon={<CloseOutlined />} type="text" onClick={() => setOpen(false)} />
                        </div>

                        <div className="chatbot-body" ref={messagesContainerRef}>
                            {messages.map((msg, i) => {
                                const showAvatar =
                                    msg.sender === "AGENT" &&
                                    (i === 0 || messages[i - 1].sender !== "AGENT");

                                return (
                                    <div key={i} className={`chatbot-message ${msg.sender === "USER" ? "user" : "bot"}`}>
                                        {showAvatar && (
                                            <div className="bot-avatar" style={{ backgroundColor: "#fa8c16" }}>
                                                🧑‍💼
                                            </div>
                                        )}
                                        <div
                                            style={{ fontSize: "15px" }}
                                            className={`chat-bubble ${msg.sender === "USER" ? "user" : "bot"}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}
                            {loading && (
                                <div className="chatbot-message bot">
                                    <div className="bot-avatar" style={{ backgroundColor: "#fa8c16" }}>🧑‍💼</div>
                                    <Spin size="small" />
                                </div>
                            )}
                        </div>

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