import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button } from "antd";
import { DownloadOutlined, CreditCardOutlined } from "@ant-design/icons";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { getRecentTransactionsAPI } from "@/services/api.service";

const columns = [
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    { title: "Nhân viên", dataIndex: "staffName", key: "staffName" },
    { title: "Khách hàng", dataIndex: "customerName", key: "customerName" },
    {
        title: "Tổng tiền",
        dataIndex: "amount",
        key: "amount",
        align: "right",
        render: (v) => v.toLocaleString() + " VNĐ",
    },
    {
        title: "Hình thức",
        dataIndex: "method",
        key: "method",
        align: "center",
        render: (m) => (
            <Tag color={m === "CASH" ? "gold" : "blue"}>
                {m === "CASH" ? "Tiền mặt" : "Online"}
            </Tag>
        ),
    },
    {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        render: (s) => (
            <Tag color={s === "PAID" ? "green" : "red"}>
                {s === "PAID" ? "Thành công" : "Chờ xử lý"}
            </Tag>
        ),
    },
    {
        title: "Ngày thực hiện",
        dataIndex: "date",
        key: "date",
        align: "center",
    },
];

const RecentTransactions = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Giao dịch");

        // 🧾 Tiêu đề các cột
        worksheet.columns = [
            { header: "ID", key: "id", width: 8 },
            { header: "Nhân viên", key: "staffName", width: 20 },
            { header: "Khách hàng", key: "customerName", width: 20 },
            { header: "Tổng tiền (VNĐ)", key: "amount", width: 18 },
            { header: "Hình thức", key: "method", width: 15 },
            { header: "Trạng thái", key: "status", width: 15 },
            { header: "Ngày thực hiện", key: "date", width: 20 },
        ];

        // 🎨 Style cho header
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "4472C4" }, // xanh dương đậm
            };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        // 🧩 Thêm dữ liệu
        data.forEach((item) => {
            worksheet.addRow({
                ...item,
                amount: item.amount.toLocaleString("vi-VN"),
                date: item.date,
                method: item.method === "CASH" ? "Tiền mặt" : "Online",
                status: item.status === "PAID" ? "Thành công" : "Chờ xử lý",
            });
        });

        // 🎀 Style cho dữ liệu
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { vertical: "middle", horizontal: "center" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
            if (rowNumber % 2 === 0 && rowNumber !== 1) {
                // tô màu xen kẽ cho dễ nhìn
                row.eachCell((cell) => {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "F2F2F2" },
                    };
                });
            }
        });

        // 💾 Xuất file
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            `GiaoDich_${dayjs().format("DD-MM-YYYY")}.xlsx`
        );
    };

    useEffect(() => {
        fetchRecentTransactions();
    }, []);

    const fetchRecentTransactions = async () => {
        try {
            const response = await getRecentTransactionsAPI();
            setData(response.data);
        } catch (error) {
            console.error("Error fetching recent transactions:", error);
        }
    };

    return (
        <Card
            bordered={false}
            style={{
                borderRadius: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CreditCardOutlined
                        style={{ color: "#1677ff", fontSize: 22, marginTop: 2 }}
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
                bordered
                rowKey="id"
                style={{ marginTop: 8 }}
                pagination={{
                    current: currentPage,
                    pageSize,
                    total: data.length,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20, 50],
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} trong tổng ${total} giao dịch`,
                }}
            />
        </Card>
    );
};

export default RecentTransactions;