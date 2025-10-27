import React from "react";
import { Row, Col, Input, Button } from "antd";
import {
    FacebookOutlined,
    YoutubeOutlined,
    InstagramOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
} from "@ant-design/icons";

const Footer = () => {
    return (
        <div style={styles.footerContainer}>
            <div style={styles.footerContent}>
                <Row gutter={[32, 32]}>
                    {/* 🔹 Cột 1: Logo & giới thiệu */}
                    <Col xs={24} sm={12} md={8}>
                        <h2 style={styles.logoText}> CNM Cinema</h2>
                        <p style={styles.text}>
                            Nơi trải nghiệm điện ảnh đỉnh cao – tận hưởng từng khoảnh khắc
                            với công nghệ hiện đại và không gian rạp sang trọng.
                        </p>
                        <div style={styles.iconRow}>
                            <a href="#" style={styles.iconLink}>
                                <FacebookOutlined />
                            </a>
                            <a href="#" style={styles.iconLink}>
                                <YoutubeOutlined />
                            </a>
                            <a href="#" style={styles.iconLink}>
                                <InstagramOutlined />
                            </a>
                        </div>
                    </Col>

                    {/* 🔹 Cột 2: Liên hệ */}
                    <Col xs={24} sm={12} md={8}>
                        <h3 style={styles.sectionTitle}>Liên hệ</h3>
                        <p style={styles.text}>
                            <EnvironmentOutlined /> 123 Đường Điện Ảnh, Quận Hoàn Kiếm, Hà Nội
                        </p>
                        <p style={styles.text}>
                            <PhoneOutlined /> Hotline: <strong>1900 1234</strong>
                        </p>
                        <p style={styles.text}>
                            <MailOutlined /> Email: support@dreamers.vn
                        </p>
                    </Col>

                    {/* 🔹 Cột 3: Đăng ký nhận tin */}
                    <Col xs={24} sm={24} md={8}>
                        <h3 style={styles.sectionTitle}>Đăng ký nhận ưu đãi</h3>
                        <p style={styles.text}>
                            Nhận ngay thông tin phim mới, khuyến mãi hấp dẫn và vé sớm.
                        </p>
                        <div style={styles.inputGroup}>
                            <Input
                                placeholder="Nhập email của bạn"
                                style={styles.emailInput}
                            />
                            <Button type="primary" style={styles.subscribeButton}>
                                Đăng ký
                            </Button>
                        </div>
                    </Col>
                </Row>

                {/* 🔹 Dòng bản quyền */}
                <div style={styles.bottomBar}>
                    <p style={{ margin: 0 }}>
                        © 2025 CNM Cinema. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

// ========================= 🎨 CSS inline =========================
const styles = {
    footerContainer: {
        background: "#333",
        color: "white",
        paddingTop: "60px",
        paddingBottom: "20px",
        marginTop: "60px",
        fontFamily: "Inter, sans-serif",
        margin: "60px -50px 0 -50px"
    },
    footerContent: {
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 20px",
    },
    logoText: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#fff",
        marginBottom: "16px",
    },
    text: {
        color: "#ddd",
        lineHeight: 1.7,
        fontSize: "15px",
    },
    sectionTitle: {
        color: "#fff",
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "12px",
    },
    iconRow: {
        marginTop: "16px",
        display: "flex",
        gap: "16px",
    },
    iconLink: {
        fontSize: "20px",
        color: "#fff",
        transition: "0.3s",
    },
    inputGroup: {
        display: "flex",
        gap: "8px",
        marginTop: "8px",
    },
    emailInput: {
        borderRadius: "6px",
    },
    subscribeButton: {
        background: "#ff944d",
        borderColor: "#ff944d",
        borderRadius: "6px",
        fontWeight: 500,
    },
    bottomBar: {
        marginTop: "40px",
        paddingTop: "20px",
        borderTop: "1px solid rgba(255,255,255,0.2)",
        textAlign: "center",
        fontSize: "14px",
        color: "#ccc",
    },
};

export default Footer;
