import FoodModalCreate from "@/components/food/food.create";
import FoodTable from "@/components/food/food.table";
import { fetchAllFoodAPI, fetchFoodTypeActiveAPI, getMediaUrlAPI, uploadTempFileAPI } from "@/services/api.service";
import { Button, Input, notification, Select } from "antd";
import { useEffect, useState } from "react";
const { Search } = Input;

const FoodListPage = () => {

    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [nameSearch, setNameSearch] = useState(null);
    const [typeSelected, setTypeSelected] = useState(null);
    const [foodTypeList, setFoodTypeList] = useState([]);
    const [dataFood, setDataFood] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageKey, setImageKey] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchFoodList();
        fetchFoodTypeList();
    }, [current, pageSize, nameSearch, typeSelected]);

    const fetchFoodTypeList = async () => {
        const res = await fetchFoodTypeActiveAPI();
        if (res.data) {
            setFoodTypeList(res.data);
        }
    }

    const fetchFoodList = async () => {
        setLoading(true);
        try {
            const res = await fetchAllFoodAPI(current, pageSize, nameSearch, typeSelected);
            if (res.data) {
                setDataFood(res.data.result)
                setCurrent(res.data.meta.page);
                setPageSize(res.data.meta.pageSize);
                setTotal(res.data.meta.total);
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
        setLoading(false);
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

    const handleChange = value => {
        if (value) {
            setTypeSelected(value);
        } else {
            setTypeSelected(null); // nếu không có giá trị thì reset
        }
    };

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

                    <Select
                        placeholder="Select type"
                        allowClear
                        onChange={handleChange}
                        style={{ width: 120 }}
                        options={foodTypeList.map(f => ({ label: f.name, value: f.id }))}
                    />
                </div>

                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Create Food
                </Button>
            </div>
            <FoodTable
                current={current}
                pageSize={pageSize}
                total={total}
                dataFood={dataFood}
                setDataFood={setDataFood}
                loading={loading}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
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
            <FoodModalCreate
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                handleUpload={handleUpload}
                uploading={uploading}
                foodTypeList={foodTypeList}
                fetchFoodList={fetchFoodList}
                setUploading={setUploading}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                imageKey={imageKey}
                setImageKey={setImageKey}
            />
        </>
    )
};

export default FoodListPage;