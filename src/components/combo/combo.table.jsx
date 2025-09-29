import { Table, Tag } from "antd";
import { useState } from "react";
import ComboImage from "./combo.image";
import ComboUpdateModal from "./combo.update";

const ComboTable = (props) => {
    const { dataCombo, current, pageSize, total, setCurrent, setPageSize, fetchComboList, foodList,
        handleUpload, uploading, imageKey, setImageKey, previewUrl, setPreviewUrl } = props;

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
            render: (text, record) => <a onClick={() => showModalUpdate(record.id)}>{text}</a>,
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

    const showModalUpdate = (id) => {
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
            <ComboUpdateModal
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                comboSelected={comboSelected}
                setComboSelected={setComboSelected}
                fetchComboList={fetchComboList}
                foodList={foodList}
                handleUpload={handleUpload}
                uploading={uploading}
                imageKey={imageKey}
                setImageKey={setImageKey}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
            />
        </>
    );
};

export default ComboTable;
