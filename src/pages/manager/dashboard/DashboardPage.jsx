import React from "react";
import { Row, Col, Divider } from "antd";
import "@/styles/dashboard.css";
import OverviewCards from "./OverviewCards";
import RevenueChart from "./RevenueChart";
import TopMoviesChart from "./TopMoviesChart";
import GenreDistributionChart from "./GenreDistributionChart";
import TopCustomers from "./TopCustomers";
import RecentTransactions from "./RecentTransactions";

const DashboardPage = () => {
    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
            </div>

            {/* 1️⃣ Tổng quan */}
            <OverviewCards />

            {/* 2️⃣ Biểu đồ doanh thu và top phim */}
            <Row gutter={[20, 20]} style={{ marginTop: 32, display: "flex", alignItems: "stretch" }}>
                <Col xs={24} lg={14} style={{ display: "flex" }}>
                    <div className="equal-card">
                        <RevenueChart />
                    </div>
                </Col>
                <Col xs={24} lg={10} style={{ display: "flex" }}>
                    <div className="equal-card">
                        <TopMoviesChart />
                    </div>
                </Col>
            </Row>

            {/* 3️⃣ Biểu đồ thể loại & khách hàng */}
            <Row gutter={[20, 20]} style={{ marginTop: 32, display: "flex", alignItems: "stretch" }}>
                <Col xs={24} lg={12} style={{ display: "flex" }}>
                    <div className="equal-card">
                        <GenreDistributionChart />
                    </div>
                </Col>
                <Col xs={24} lg={12} style={{ display: "flex" }}>
                    <div className="equal-card">
                        <TopCustomers />
                    </div>
                </Col>
            </Row>

            {/* 4️⃣ Giao dịch gần đây */}
            <div style={{ marginTop: 40 }}>
                <RecentTransactions />
            </div>
        </div>
    );
};

export default DashboardPage;