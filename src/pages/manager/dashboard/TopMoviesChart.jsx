import React from "react";
import { Card, Typography } from "antd";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
    CartesianGrid,
    Cell,
} from "recharts";
import { PlaySquareOutlined } from "@ant-design/icons";

const { Text } = Typography;

const data = [
    { title: "Inside Out 2", revenue: 150000000 },
    { title: "Dune: Part Two", revenue: 120000000 },
    { title: "Deadpool & Wolverine", revenue: 132000000 },
    { title: "Kung Fu Panda 4", revenue: 83000000 },
    { title: "Godzilla x Kong", revenue: 78000000 },
    { title: "Despicable Me 4", revenue: 69000000 },
];

const COLORS = ["#722ED1", "#9254DE", "#B37FEB", "#1890FF", "#36CFC9", "#13C2C2"];

const TopMoviesChart = () => {
    return (
        <Card
            bordered={false}
            style={{
                borderRadius: 20,
                boxShadow: "0 6px 25px rgba(0,0,0,0.05)",
                background: "#fff",
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
                        background: "linear-gradient(to right, #722ED1, #13C2C2)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    <PlaySquareOutlined style={{ color: "#722ED1" }} />
                    Top phim doanh thu cao nhất
                </div>
            }
        >
            <ResponsiveContainer width="100%" height={360}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 10, right: 40, left: 80, bottom: 10 }}
                >
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#722ED1" />
                            <stop offset="100%" stopColor="#13C2C2" />
                        </linearGradient>
                    </defs>

                    {/* Lưới nền */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />

                    {/* Trục X (Doanh thu) */}
                    <XAxis
                        type="number"
                        tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                        axisLine={false}
                        tickLine={false}
                        fontSize={12}
                        tick={{ fill: "#595959" }}
                    />

                    {/* Trục Y (Tên phim) */}
                    <YAxis
                        dataKey="title"
                        type="category"
                        width={140}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#444", fontWeight: 500, fontSize: 13 }}
                    />

                    {/* Tooltip hiện đại */}
                    <Tooltip
                        formatter={(value) => `${value.toLocaleString()} VNĐ`}
                        labelStyle={{ fontWeight: 600 }}
                        contentStyle={{
                            background: "#fff",
                            borderRadius: 10,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            border: "1px solid #eee",
                        }}
                    />

                    {/* Biểu đồ cột */}
                    <Bar
                        dataKey="revenue"
                        fill="url(#barGradient)"
                        barSize={18}
                        radius={[0, 8, 8, 0]}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}

                        {/* Nhãn doanh thu */}
                        <LabelList
                            dataKey="revenue"
                            position="right"
                            formatter={(v) => `${(v / 1_000_000).toFixed(0)}M VNĐ`}
                            style={{ fill: "#595959", fontSize: 12 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default TopMoviesChart;