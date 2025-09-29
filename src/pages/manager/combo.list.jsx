import ComboCreateModal from "@/components/combo/combo.create";
import ComboTable from "@/components/combo/combo.table";
import { fetchAllCombosAPI, fetchAllFoodsActiveAPI, getMediaUrlAPI, uploadTempFileAPI } from "@/services/api.service";
import { Button, notification } from "antd";
import Search from "antd/es/input/Search";
import { useEffect, useState } from "react";

const ComboListPage = () => {

    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [nameSearch, setNameSearch] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataCombo, setDataCombo] = useState([]);
    const [foodList, setFoodList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [imageKey, setImageKey] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);


    useEffect(() => {
        fetchComboList();
        fetchFoodList();
    }, [current, pageSize, nameSearch]);

    const fetchComboList = async () => {
        setLoading(true);
        try {
            const res = await fetchAllCombosAPI(current, pageSize, nameSearch);
            if (res.data) {
                setDataCombo(res.data.result)
                setCurrent(res.data.meta.page);
                setPageSize(res.data.meta.pageSize);
                setTotal(res.data.meta.total);
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
        setLoading(false);
    }

    const fetchFoodList = async () => {
        const res = await fetchAllFoodsActiveAPI();
        if (res.data) {
            setFoodList(res.data);
        }
    }

    const onSearch = (value, _e, info) => {
        if (value) {
            let trimmedValue = value.trim();
            setNameSearch(trimmedValue);
            setCurrent(); // reset về trang đầu tiên khi tìm kiếm
        } else {
            setNameSearch(null); // nếu không có giá trị tìm kiếm thì reset
            setCurrent(0); // reset về trang đầu tiên
        }
    }

    const handleUpload = async ({ file }) => {
        setUploading(true);
        try {
            const res = await uploadTempFileAPI(file); // call API upload file
            if (res.data) {
                notification.success({
                    message: "Success",
                    description: "Upload image thành công!",
                });
                setImageKey(res.data); // lưu lại imageKey
                const urlRes = await getMediaUrlAPI(res.data);
                setPreviewUrl(urlRes.data);
            } else {
                notification.error({
                    message: "Failed",
                    description: JSON.stringify(res.message)
                });
            }
        } catch (err) {
            notification.error({ message: err.message || "Upload image thất bại" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', flex: 1, gap: '10px', alignItems: 'center' }}>
                    <Search
                        placeholder="Nhập tên..."
                        allowClear
                        onSearch={onSearch}
                        style={{ width: 200 }}
                    />
                </div>

                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Create Combo
                </Button>
            </div>
            <ComboTable
                current={current}
                pageSize={pageSize}
                total={total}
                dataCombo={dataCombo}
                setDataCombo={setDataCombo}
                loading={loading}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
                fetchComboList={fetchComboList}
                foodList={foodList}
                handleUpload={handleUpload}
                uploading={uploading}
                imageKey={imageKey}
                setImageKey={setImageKey}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
            />
            <ComboCreateModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                fetchComboList={fetchComboList}
                uploading={uploading}
                setUploading={setUploading}
                imageKey={imageKey}
                setImageKey={setImageKey}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                handleUpload={handleUpload}
                foodList={foodList}
            />
        </>
    )
}

export default ComboListPage;