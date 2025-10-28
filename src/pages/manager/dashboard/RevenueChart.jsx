import React, { useEffect, useState } from "react";
import { Card } from "antd";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { LineChartOutlined } from "@ant-design/icons";
import { getMonthRevenueAPI } from "@/services/api.service";

const RevenueChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = async () => {
        try {
            const res = await getMonthRevenueAPI(); // gọi API backend
            if (res.data) {
                const chartData = res.data.map(item => ({
                    month: new Date(2025, item.month - 1).toLocaleString('default', { month: 'short' }),
                    revenue: item.revenue,
                    tickets: item.tickets,
                }));
                setData(chartData);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Card
            bordered={false}
            style={{
                borderRadius: 20,
                background: "#fff",
                boxShadow: "0 6px 25px rgba(0,0,0,0.05)",
                overflow: "hidden",
            }}
            title={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontWeight: 600,
                        fontSize: 16,
                        background: "linear-gradient(to right, #1677ff, #52c41a)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    <LineChartOutlined style={{ color: "#1677ff" }} />
                    Doanh thu & Vé bán quý hiện tại
                </div>
            }
        >
            <ResponsiveContainer width="100%" height={380}>
                <LineChart data={data} margin={{ top: 30, right: 40, left: 20, bottom: 10 }}>
                    {/* Lưới nền nhẹ nhàng */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />

                    {/* Trục X */}
                    <XAxis
                        dataKey="month"
                        tick={{ fill: "#666", fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    {/* Trục Y trái (Doanh thu) */}
                    <YAxis
                        yAxisId="left"
                        tick={{ fill: "#666", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                    />

                    {/* Trục Y phải (Vé bán) */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: "#666", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    {/* Tooltip */}
                    <Tooltip
                        contentStyle={{
                            background: "#fff",
                            border: "1px solid #eee",
                            borderRadius: 10,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                        }}
                        labelStyle={{ fontWeight: 600, color: "#555" }}
                        formatter={(value, name) =>
                            name === "Vé bán"
                                ? [`${value} vé`, "Vé bán"]
                                : [`${value.toLocaleString()} VNĐ`, "Doanh thu"]
                        }
                    />

                    {/* Chú thích */}
                    <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{
                            paddingBottom: 20,
                            fontWeight: 500,
                            fontSize: 13,
                        }}
                    />

                    {/* Đường tham chiếu */}
                    <ReferenceLine
                        y={85000000}
                        yAxisId="left"
                        stroke="#ddd"
                        strokeDasharray="4 4"
                        label={{
                            value: "Mức trung bình",
                            position: "insideTopRight",
                            fill: "#999",
                            fontSize: 12,
                        }}
                    />

                    {/* Đường Doanh thu */}
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1677ff"
                        strokeWidth={3}
                        name="Doanh thu (VNĐ)"
                        dot={{
                            r: 5,
                            strokeWidth: 2,
                            fill: "#fff",
                            stroke: "#1677ff",
                        }}
                        activeDot={{
                            r: 7,
                            fill: "#1677ff",
                            stroke: "#fff",
                            strokeWidth: 2,
                        }}
                    />

                    {/* Đường Vé bán */}
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="tickets"
                        stroke="#52c41a"
                        strokeWidth={3}
                        name="Vé bán"
                        dot={{
                            r: 5,
                            strokeWidth: 2,
                            fill: "#fff",
                            stroke: "#52c41a",
                        }}
                        activeDot={{
                            r: 7,
                            fill: "#52c41a",
                            stroke: "#fff",
                            strokeWidth: 2,
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default RevenueChart;