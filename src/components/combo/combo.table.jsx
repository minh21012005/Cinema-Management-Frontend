import { Table, Tag } from "antd";
import { useState } from "react";
import ComboImage from "./combo.image";

const ComboTable = (props) => {
    const { dataCombo, current, pageSize, total, setCurrent, setPageSize, fetchComboList } = props;

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [comboSelected, setComboSelected] = useState(null);

    const columns = [
        {
            title: "STT",
            render: (_, record, index) => <div>{index + 1 + current * pageSize}</div>,
        },
        {
            title: "Mã combo",
            dataIndex: "code",
            key: "code",
            render: (text, record) => <a onClick={() => handleUpdate(record.id)}>{text}</a>,
        },
        {
            title: "Tên combo",
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
            title: "Trạng thái",
            dataIndex: "available",
            key: "available",
            render: (value) =>
                value ? <Tag color="green">Còn bán</Tag> : <Tag color="red">Ngừng bán</Tag>,
        },
        {
            title: "Ảnh",
            dataIndex: "imageKey",
            key: "imageKey",
            render: (key) => <ComboImage imageKey={key} />,
        }
    ];

    const onChange = (pagination) => {
        if (pagination?.current) {
            const newCurrent = pagination.current - 1;
            if (newCurrent !== current) {
                setCurrent(newCurrent);
            }
        }

        if (pagination?.pageSize && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
        }
    };

    const handleUpdate = (id) => {
        const combo = dataCombo.find((c) => c.id === id);
        setComboSelected(combo);
        setIsModalUpdateOpen(true);
    };

    return (
        <>
            <Table
                columns={columns}
                dataSource={dataCombo || []}
                rowKey="id"
                pagination={{
                    current: current + 1,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    total: total,
                    showTotal: (total, range) => (
                        <div>
                            {range[0]}-{range[1]} trên {total} combo
                        </div>
                    ),
                }}
                onChange={onChange}
            />
        </>
    );
};

export default ComboTable;
