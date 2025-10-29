import React, { useEffect, useState } from "react";
import { Card } from "antd";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { PieChartOutlined } from "@ant-design/icons";
import { getMovieGenresDistributionAPI } from "@/services/api.service";

// 🎨 Màu gradient
const COLORS = [
    "url(#colorAction)",
    "url(#colorRomance)",
    "url(#colorHorror)",
    "url(#colorAnimation)",
    "url(#colorComedy)",
];

const GenreDistributionChart = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchGenreDistribution();
    }, []);

    const fetchGenreDistribution = async () => {
        const res = await getMovieGenresDistributionAPI();
        if (res && res.data) {
            let genres = res.data;

            // Sắp xếp theo tỷ lệ giảm dần
            genres.sort((a, b) => b.value - a.value);

            // Lấy top 4
            const top4 = genres.slice(0, 4);

            // Tính tổng phần còn lại
            const othersValue = genres.slice(4).reduce((sum, g) => sum + g.value, 0);

            // Gộp lại: top 4 + "Khác"
            if (othersValue > 0) {
                top4.push({
                    name: "Khác",
                    value: parseFloat(othersValue.toFixed(2)),
                });
            }

            setData(top4);
        }
    };

    return (
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
                    <PieChartOutlined style={{ color: "#722ed1", fontSize: 22 }} />
                    <span>Tỷ lệ thể loại phim</span>
                </div>
            }
            headStyle={{
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: 12,
                marginBottom: 8,
            }}
        >
            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    {/* Gradient */}
                    <defs>
                        <linearGradient id="colorAction" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#1890ff" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#40a9ff" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="colorRomance" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#faad14" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#ffc53d" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="colorHorror" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#f5222d" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#ff7875" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="colorAnimation" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#52c41a" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#95de64" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="colorComedy" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#722ed1" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#b37feb" stopOpacity={1} />
                        </linearGradient>
                    </defs>

                    {/* Biểu đồ chính */}
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={110}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    {/* Tooltip + Legend */}
                    <Tooltip
                        formatter={(value) => `${value}%`}
                        contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            borderRadius: 10,
                            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            border: "none",
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => (
                            <span style={{ fontSize: 14, color: "#555" }}>{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default GenreDistributionChart;