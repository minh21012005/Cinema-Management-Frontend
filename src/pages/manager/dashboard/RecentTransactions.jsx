import React from "react";
import { Card, Table, Tag, Button } from "antd";
import { DownloadOutlined, CreditCardOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const columns = [
    { title: "Mã giao dịch", dataIndex: "code", key: "code" },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    { title: "Phim", dataIndex: "movie", key: "movie" },
    { title: "Số vé", dataIndex: "tickets", key: "tickets", align: "center" },
    {
        title: "Tổng tiền",
        dataIndex: "amount",
        key: "amount",
        align: "right",
        render: (v) => v.toLocaleString() + " VNĐ",
    },
    {
        title: "Trạng thái",
        dataIndex: "status",
        align: "center",
        render: (s) => (
            <Tag color={s === "Thành công" ? "green" : "red"}>{s}</Tag>
        ),
    },
    {
        title: "Ngày",
        dataIndex: "date",
        key: "date",
        render: (v) => dayjs(v).format("DD/MM/YYYY"),
        align: "center",
    },
];

const data = [
    {
        key: "1",
        code: "TX001",
        customer: "Nguyễn Văn A",
        movie: "Inside Out 2",
        tickets: 3,
        amount: 450000,
        status: "Thành công",
        date: "2025-10-27",
    },
    {
        key: "2",
        code: "TX002",
        customer: "Trần Thị B",
        movie: "Deadpool",
        tickets: 2,
        amount: 300000,
        status: "Thành công",
        date: "2025-10-27",
    },
    {
        key: "3",
        code: "TX003",
        customer: "Phạm C",
        movie: "Dune 2",
        tickets: 4,
        amount: 600000,
        status: "Thất bại",
        date: "2025-10-26",
    },
];

const RecentTransactions = () => {
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transactions");
        XLSX.writeFile(wb, `Transactions_${dayjs().format("YYYY-MM-DD")}.xlsx`);
    };

    return (
        <Card
            bordered={false}
            style={{
                borderRadius: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            title={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <CreditCardOutlined
                        style={{
                            color: "#1677ff",
                            fontSize: 22,
                            marginTop: 2,
                        }}
                    />
                    <span
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#1f1f1f",
                        }}
                    >
                        Giao dịch gần đây
                    </span>
                </div>
            }
            extra={
                <Button
                    icon={<DownloadOutlined />}
                    type="primary"
                    onClick={exportToExcel}
                    style={{ borderRadius: 8 }}
                >
                    Xuất Excel
                </Button>
            }
        >
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
                style={{ marginTop: 8 }}
            />
        </Card>
    );
};

export default RecentTransactions;