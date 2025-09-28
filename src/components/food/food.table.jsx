import { Table, Tag } from "antd";
import FoodImage from "./food.image";
import FoodUpdateModal from "./food.update";
import { useState } from "react";

const FoodTable = (props) => {
    const { dataFood, current, pageSize, total, setCurrent, setPageSize, foodTypeList, fetchFoodList,
        handleUpload, uploading, setUploading, imageKey, setImageKey, previewUrl, setPreviewUrl } = props;

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [foodSelected, setFoodSelected] = useState(null);

    const columns = [
        {
            title: "STT",
            render: (_, record, index) => <div>{index + 1 + current * pageSize}</div>,
        },
        {
            title: "Mã món",
            dataIndex: "code",
            key: "code",
            render: (text, record) => <a onClick={() => { handleUpdate(record.id) }}>{text}</a>,
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

    const handleUpdate = (id) => {
        const food = dataFood.find((f) => f.id === id);
        setFoodSelected(food);
        setIsModalUpdateOpen(true);
    }

    return (
        <>
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
            <FoodUpdateModal
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                foodSelected={foodSelected}
                setFoodSelected={setFoodSelected}
                loadFood={props.loadFood}
                foodTypeList={foodTypeList}
                handleUpload={handleUpload}
                uploading={uploading}
                setUploading={setUploading}
                imageKey={imageKey}
                setImageKey={setImageKey}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                fetchFoodList={fetchFoodList}
            />
        </>
    );
};

export default FoodTable;
