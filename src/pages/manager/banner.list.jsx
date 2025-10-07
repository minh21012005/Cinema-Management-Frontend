import BannerModalCreate from "@/components/banner/banner.create";
import BannerTable from "@/components/banner/banner.table";
import { fetchAllBannerAPI, getMediaUrlAPI, uploadTempFileAPI } from "@/services/api.service";
import { Button, Input, notification } from "antd";
import { useEffect, useState } from "react";
const { Search } = Input;

const BannerListPage = () => {
    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [titleSearch, setTitleSearch] = useState(null);
    const [dataBanner, setDataBanner] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageKey, setImageKey] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchBannerList();
    }, [current, pageSize, titleSearch]);

    const fetchBannerList = async () => {
        setLoading(true);
        try {
            const res = await fetchAllBannerAPI(current, pageSize, titleSearch);
            if (res.data) {
                setDataBanner(res.data.result);
                setCurrent(res.data.meta.page);
                setPageSize(res.data.meta.pageSize);
                setTotal(res.data.meta.total);
            }
        } catch (error) {
            console.error("Error fetching banner list:", error);
        }
        setLoading(false);
    };

    const onSearch = (value) => {
        setTitleSearch(value ? value.trim() : null);
        setCurrent(0);
    };

    const handleUpload = async ({ file }) => {
        setUploading(true);
        try {
            const res = await uploadTempFileAPI(file);
            if (res.data) {
                notification.success({ message: "Upload image thành công!" });
                setImageKey(res.data);
                const urlRes = await getMediaUrlAPI(res.data);
                setPreviewUrl(urlRes.data);
            } else {
                notification.error({ message: "Upload thất bại", description: res.message });
            }
        } catch (err) {
            notification.error({ message: err.message || "Upload thất bại" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Search
                    placeholder="Nhập tiêu đề banner..."
                    allowClear
                    onSearch={onSearch}
                    style={{ width: 300 }}
                />
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Create Banner
                </Button>
            </div>

            <BannerTable
                current={current}
                pageSize={pageSize}
                total={total}
                dataBanner={dataBanner}
                setDataBanner={setDataBanner}
                loading={loading}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
                handleUpload={handleUpload}
                uploading={uploading}
                setUploading={setUploading}
                imageKey={imageKey}
                setImageKey={setImageKey}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                fetchBannerList={fetchBannerList}
            />

            <BannerModalCreate
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                handleUpload={handleUpload}
                uploading={uploading}
                fetchBannerList={fetchBannerList}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                imageKey={imageKey}
                setImageKey={setImageKey}
            />
        </>
    );
};

export default BannerListPage;
