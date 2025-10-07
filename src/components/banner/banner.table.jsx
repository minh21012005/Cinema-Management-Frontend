import { Space, Table, Tag } from "antd";
import { useState } from "react";
import BannerImage from "./banner.image";
import { EditOutlined } from "@ant-design/icons";
import BannerUpdateModal from "./banner.update";

const BannerTable = (props) => {
    const { dataBanner, current, pageSize, total, setCurrent, setPageSize,
        handleUpload, uploading, setUploading, imageKey, setImageKey, previewUrl, setPreviewUrl,
        fetchBannerList } = props;

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [bannerSelected, setBannerSelected] = useState(null);

    const columns = [
        {
            title: "STT",
            render: (_, record, index) => <div>{index + 1 + current * pageSize}</div>,
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Active",
            dataIndex: "active",
            key: "active",
            render: (value) => value ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
        },
        {
            title: "Thứ tự",
            dataIndex: "displayOrder",
            key: "displayOrder",
        },
        {
            title: "Ảnh",
            dataIndex: "imageKey",
            key: "imageKey",
            render: (key) => <BannerImage imageKey={key} />,
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => handleUpdate(record.id)}
                        style={{ cursor: "pointer", color: "orange" }}
                    />
                </Space>
            ),
        },
    ];

    const onChange = (pagination) => {
        if (pagination?.current) setCurrent(pagination.current - 1);
        if (pagination?.pageSize) setPageSize(pagination.pageSize);
    };

    const handleUpdate = (id) => {
        const banner = dataBanner.find(b => b.id === id);
        setBannerSelected(banner);
        setIsModalUpdateOpen(true);
    }

    return (
        <>
            <Table
                columns={columns}
                dataSource={dataBanner || []}
                rowKey="id"
                pagination={{
                    current: current + 1,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    total: total,
                    showTotal: (total, range) => (
                        <div>{range[0]}-{range[1]} trên {total} banner</div>
                    ),
                }}
                onChange={onChange}
            />
            <BannerUpdateModal
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                bannerSelected={bannerSelected}
                setBannerSelected={setBannerSelected}
                handleUpload={handleUpload}
                uploading={uploading}
                setUploading={setUploading}
                imageKey={imageKey}
                setImageKey={setImageKey}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                fetchBannerList={fetchBannerList}
            />
        </>
    );
};

export default BannerTable;
