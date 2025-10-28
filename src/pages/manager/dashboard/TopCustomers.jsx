import React from "react";
import { Card, Table, Avatar, Tag } from "antd";
import { CrownOutlined } from "@ant-design/icons";

// 🧩 Cấu hình cột bảng
const columns = [
    {
        title: "Khách hàng",
        dataIndex: "name",
        render: (name, record) => (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar
                    src={record.avatar}
                    size={44}
                    style={{
                        border: "2px solid #f0f0f0",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 600, color: "#1f1f1f" }}>{name}</span>
                    <span style={{ fontSize: 13, color: "#8c8c8c" }}>#{record.key}</span>
                </div>
            </div>
        ),
    },
    {
        title: "Tổng vé mua",
        dataIndex: "tickets",
        key: "tickets",
        align: "center",
        render: (v) => <strong style={{ color: "#1890ff" }}>{v}</strong>,
    },
    {
        title: "Tổng chi tiêu",
        dataIndex: "spending",
        key: "spending",
        align: "center",
        render: (v) => (
            <span style={{ fontWeight: 500, color: "#52c41a" }}>
                {v.toLocaleString()} VNĐ
            </span>
        ),
    },
    {
        title: "Hạng",
        dataIndex: "tier",
        key: "tier",
        align: "center",
        render: (tier) => {
            let color = "#d9d9d9";
            if (tier === "Vàng") color = "#faad14";
            else if (tier === "Bạc") color = "#bfbfbf";
            else if (tier === "Đồng") color = "#d46b08";

            return (
                <Tag
                    color={color}
                    style={{
                        borderRadius: 8,
                        padding: "4px 10px",
                        fontWeight: 600,
                        color: tier === "Bạc" ? "#fff" : "#000",
                    }}
                >
                    {tier}
                </Tag>
            );
        },
    },
];

// 💰 Dữ liệu mẫu
const data = [
    {
        key: 1,
        name: "Nguyễn Văn A",
        tickets: 42,
        spending: 6200000,
        tier: "Vàng",
        avatar: "https://i.pravatar.cc/50?img=1",
    },
    {
        key: 2,
        name: "Trần Thị B",
        tickets: 36,
        spending: 5400000,
        tier: "Bạc",
        avatar: "https://i.pravatar.cc/50?img=2",
    },
    {
        key: 3,
        name: "Phạm C",
        tickets: 28,
        spending: 4200000,
        tier: "Đồng",
        avatar: "https://i.pravatar.cc/50?img=3",
    },
];

// 🏆 Component chính
const TopCustomers = () => (
    <Card
        bordered={false}
        style={{
            borderRadius: 20,
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}
        title={
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#1f1f1f",
                }}
            >
                <CrownOutlined style={{ color: "#faad14", fontSize: 22 }} />
                <span>Top khách hàng thân thiết</span>
            </div>
        }
        headStyle={{
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: 10,
            marginBottom: 8,
        }}
    >
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName="hover-row"
            style={{ borderRadius: 16, overflow: "hidden" }}
        />
    </Card>
);

export default TopCustomers;