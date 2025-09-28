import { getMediaUrlAPI } from "@/services/api.service";
import { Table, Tag } from "antd";
import { useState } from "react";
import FoodImage from "./food.image";

const FoodTable = (props) => {
    const { dataFood, current, pageSize, total, setCurrent, setPageSize } = props;

    const columns = [
        {
            title: "STT",
            render: (_, record, index) => <div>{index + 1 + current * pageSize}</div>,
        },
        {
            title: "Mã món",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Tên món",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Giá",
            dataIndex: "price",
            key: "price",
            render: (value) => `${value.toLocaleString()} VNĐ`,
        },
        {
            title: "Loại món",
            dataIndex: "typeName",
            key: "foodType",
        },
        {
            title: "Trạng thái",
            dataIndex: "available",
            key: "available",
            render: (value) =>
                value ? <Tag color="green">Còn bán</Tag> : <Tag color="red">Hết hàng</Tag>,
        },
        {
            title: "Ảnh",
            dataIndex: "imageKey",
            key: "imageKey",
            render: (key) => <FoodImage imageKey={key} />,
        }
    ];

    const onChange = (pagination) => {
        if (pagination && pagination.current) {
            const newCurrent = pagination.current - 1;
            if (newCurrent !== current) {
                setCurrent(newCurrent);
            }
        }

        if (pagination && pagination.pageSize) {
            if (pagination.pageSize !== pageSize) {
                setPageSize(pagination.pageSize);
            }
        }
    };

    return (
        <Table
            columns={columns}
            dataSource={dataFood || []}
            rowKey="id"
            pagination={{
                current: current + 1,
                pageSize: pageSize,
                showSizeChanger: true,
                total: total,
                showTotal: (total, range) => (
                    <div>
                        {range[0]}-{range[1]} trên {total} món ăn
                    </div>
                ),
            }}
            onChange={onChange}
        />
    );
};

export default FoodTable;
