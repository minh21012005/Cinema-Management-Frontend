import React, { useEffect, useState } from "react";
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
import {
    getActiveShowtimesAPI, getAverageRatingAPI, getDailyRevenueAPI, getMonthlyRevenueAPI,
    getNewUsersAPI, getNowShowingMovieAPI, getOccupancyRateAPI, getTicketsSoldTodayAPI
} from "@/services/api.service";

const { Text } = Typography;

const OverviewCards = () => {
    const [dailyRevenue, setDailyRevenue] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState(null);
    const [ticketsSoldToday, setTicketsSoldToday] = useState(null);
    const [activeShowtimes, setActiveShowtimes] = useState(null);
    const [nowShowingMovies, setNowShowingMovies] = useState(null);
    const [averageRating, setAverageRating] = useState(null);
    const [newUsers, setNewUsers] = useState(null);
    const [occupancyRate, setOccupancyRate] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRevenueData();
    }, []);

    const fetchRevenueData = async () => {
        setLoading(true);
        try {
            const dailyRes = await getDailyRevenueAPI();
            const monthlyRes = await getMonthlyRevenueAPI();
            const ticketSoldRes = await getTicketsSoldTodayAPI();
            const activeShowtimesRes = await getActiveShowtimesAPI();
            const nowShowingRes = await getNowShowingMovieAPI();
            const averageRatingRes = await getAverageRatingAPI();
            const newUsersRes = await getNewUsersAPI();
            const occupancyRateRes = await getOccupancyRateAPI();

            // Kiểm tra nếu là số thì mới set, ngược lại set = 0
            if (typeof dailyRes.data === "number" && isFinite(dailyRes.data)) {
                setDailyRevenue(dailyRes.data);
            } else if (dailyRes.data && typeof dailyRes.data.total === "number") {
                setDailyRevenue(dailyRes.data.total);
            } else {
                setDailyRevenue(0);
            }

            if (typeof monthlyRes.data === "number" && isFinite(monthlyRes.data)) {
                setMonthlyRevenue(monthlyRes.data);
            } else if (monthlyRes.data && typeof monthlyRes.data.total === "number") {
                setMonthlyRevenue(monthlyRes.data.total);
            } else {
                setMonthlyRevenue(0);
            }

            if (typeof ticketSoldRes.data === "number" && isFinite(ticketSoldRes.data)) {
                setTicketsSoldToday(ticketSoldRes.data);
            } else if (ticketSoldRes.data && typeof ticketSoldRes.data.total === "number") {
                setTicketsSoldToday(ticketSoldRes.data.total);
            } else {
                setTicketsSoldToday(0);
            }

            if (typeof activeShowtimesRes.data === "number" && isFinite(activeShowtimesRes.data)) {
                setActiveShowtimes(activeShowtimesRes.data);
            } else if (activeShowtimesRes.data && typeof activeShowtimesRes.data.total === "number") {
                setActiveShowtimes(activeShowtimesRes.data.total);
            } else {
                setActiveShowtimes(0);
            }

            if (typeof nowShowingRes.data === "number" && isFinite(nowShowingRes.data)) {
                setNowShowingMovies(nowShowingRes.data);
            } else if (nowShowingRes.data && typeof nowShowingRes.data.total === "number") {
                setNowShowingMovies(nowShowingRes.data.total);
            } else {
                setNowShowingMovies(0);
            }

            if (typeof averageRatingRes.data === "number" && isFinite(averageRatingRes.data)) {
                setAverageRating(averageRatingRes.data);
            } else if (averageRatingRes.data && typeof averageRatingRes.data.total === "number") {
                setAverageRating(averageRatingRes.data.total);
            } else {
                setAverageRating(0);
            }

            if (typeof newUsersRes.data === "number" && isFinite(newUsersRes.data)) {
                setNewUsers(newUsersRes.data);
            } else if (newUsersRes.data && typeof newUsersRes.data.total === "number") {
                setNewUsers(newUsersRes.data.total);
            } else {
                setNewUsers(0);
            }

            if (typeof occupancyRateRes.data === "number" && isFinite(occupancyRateRes.data)) {
                setOccupancyRate(occupancyRateRes.data);
            } else if (occupancyRateRes.data && typeof occupancyRateRes.data.total === "number") {
                setOccupancyRate(occupancyRateRes.data.total);
            } else {
                setOccupancyRate(0);
            }

        } catch (error) {
            console.error("Error fetching revenue data:", error);
            setDailyRevenue(0);
            setMonthlyRevenue(0);
        }
        setLoading(false);
    };

    const cards = [
        {
            title: "Tổng doanh thu tháng",
            value: monthlyRevenue ? monthlyRevenue : 0,
            suffix: "VNĐ",
            icon: <CrownOutlined />,
            trend: "+9%",
            color: "linear-gradient(135deg, #ffe7ba 0%, #fa8c16 100%)",
        },
        {
            title: "Doanh thu hôm nay",
            value: dailyRevenue ? dailyRevenue : 0,
            suffix: "VNĐ",
            icon: <DollarOutlined />,
            trend: "+12%",
            color: "linear-gradient(135deg, #b7eb8f 0%, #73d13d 100%)",
        },
        {
            title: "Vé bán hôm nay",
            value: ticketsSoldToday ? ticketsSoldToday : 0,
            icon: <TransactionOutlined />,
            trend: "+5%",
            color: "linear-gradient(135deg, #91d5ff 0%, #1890ff 100%)",
        },
        {
            title: "Phim đang chiếu",
            value: nowShowingMovies ? nowShowingMovies : 0,
            icon: <VideoCameraOutlined />,
            trend: "0%",
            color: "linear-gradient(135deg, #d3adf7 0%, #722ed1 100%)",
        },
        {
            title: "Tỉ lệ lấp đầy ghế tháng",
            value: occupancyRate !== null && occupancyRate !== undefined
                ? `${occupancyRate.toFixed(2)}%`
                : "0.00%",
            icon: <RiseOutlined />,
            trend: "+3%",
            color: "linear-gradient(135deg, #ffd591 0%, #fa8c16 100%)",
        },
        {
            title: "Suất chiếu hoạt động",
            value: activeShowtimes ? activeShowtimes : 0,
            icon: <CalendarOutlined />,
            trend: "+8%",
            color: "linear-gradient(135deg, #87e8de 0%, #13c2c2 100%)",
        },
        {
            title: "Đánh giá trung bình",
            value: averageRating ? averageRating.toFixed(1) : "0.0",
            suffix: "/5",
            icon: <StarOutlined />,
            trend: "+0.2",
            color: "linear-gradient(135deg, #ffe58f 0%, #faad14 100%)",
        },
        {
            title: "Người dùng mới",
            value: newUsers ? newUsers : 0,
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