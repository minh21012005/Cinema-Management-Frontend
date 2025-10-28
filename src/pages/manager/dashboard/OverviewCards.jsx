import React from "react";
import { Card, Col, Row, Statistic, Tag, Tooltip, Typography } from "antd";
import {
    DollarOutlined,
    VideoCameraOutlined,
    TeamOutlined,
    RiseOutlined,
    StarOutlined,
    CalendarOutlined,
    TransactionOutlined,
    CrownOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const OverviewCards = () => {
    const cards = [
        {
            title: "Tổng doanh thu tháng",
            value: 3_480_000_000,
            suffix: "VNĐ",
            icon: <CrownOutlined />,
            trend: "+9%",
            color: "linear-gradient(135deg, #ffe7ba 0%, #fa8c16 100%)",
        },
        {
            title: "Doanh thu hôm nay",
            value: 120_000_000,
            suffix: "VNĐ",
            icon: <DollarOutlined />,
            trend: "+12%",
            color: "linear-gradient(135deg, #b7eb8f 0%, #73d13d 100%)",
        },
        {
            title: "Vé bán hôm nay",
            value: 845,
            icon: <TransactionOutlined />,
            trend: "+5%",
            color: "linear-gradient(135deg, #91d5ff 0%, #1890ff 100%)",
        },
        {
            title: "Phim đang chiếu",
            value: 22,
            icon: <VideoCameraOutlined />,
            trend: "0%",
            color: "linear-gradient(135deg, #d3adf7 0%, #722ed1 100%)",
        },
        {
            title: "Tỉ lệ lấp đầy rạp",
            value: "78%",
            icon: <RiseOutlined />,
            trend: "+3%",
            color: "linear-gradient(135deg, #ffd591 0%, #fa8c16 100%)",
        },
        {
            title: "Suất chiếu hoạt động",
            value: 64,
            icon: <CalendarOutlined />,
            trend: "+8%",
            color: "linear-gradient(135deg, #87e8de 0%, #13c2c2 100%)",
        },
        {
            title: "Đánh giá trung bình",
            value: 4.6,
            suffix: "/5",
            icon: <StarOutlined />,
            trend: "+0.2",
            color: "linear-gradient(135deg, #ffe58f 0%, #faad14 100%)",
        },
        {
            title: "Người dùng mới",
            value: 134,
            icon: <TeamOutlined />,
            trend: "+14%",
            color: "linear-gradient(135deg, #ffadd2 0%, #eb2f96 100%)",
        },
    ];

    return (
        <Row gutter={[20, 20]}>
            {cards.map((c, i) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={i}>
                    <Card
                        bordered={false}
                        hoverable
                        style={{
                            borderRadius: 18,
                            background: "#fff",
                            boxShadow: "0 3px 15px rgba(0,0,0,0.04)",
                            transition: "all 0.25s ease",
                            cursor: "pointer",
                        }}
                        bodyStyle={{ padding: "20px 24px" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            {/* Icon */}
                            <div
                                style={{
                                    background: c.color,
                                    borderRadius: "50%",
                                    width: 52,
                                    height: 52,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontSize: 22,
                                    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                                    opacity: 0.9,
                                }}
                            >
                                {c.icon}
                            </div>

                            {/* Content */}
                            <div style={{ textAlign: "right" }}>
                                <Text style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>
                                    {c.title}
                                </Text>
                                <Statistic
                                    value={c.value}
                                    suffix={
                                        <span style={{ fontSize: 14, color: "#888" }}>
                                            {c.suffix}
                                        </span>
                                    }
                                    valueStyle={{
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: "#222",
                                    }}
                                />
                                <Tooltip title="So với hôm qua">
                                    <Tag
                                        color={
                                            c.trend.startsWith("+")
                                                ? "success"
                                                : c.trend === "0%"
                                                    ? "default"
                                                    : "error"
                                        }
                                        style={{
                                            fontWeight: 500,
                                            borderRadius: 8,
                                            marginTop: 4,
                                            fontSize: 12,
                                            border: "none",
                                        }}
                                    >
                                        {c.trend}
                                    </Tag>
                                </Tooltip>
                            </div>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default OverviewCards;