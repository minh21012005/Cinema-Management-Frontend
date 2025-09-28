import { commitFileAPI, deleteFileAPI, getMediaUrlAPI, updateFoodAPI } from "@/services/api.service";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, InputNumber, Modal, notification, Select, Upload } from "antd";
import { useEffect, useState } from "react";

const FoodUpdateModal = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, foodSelected, setFoodSelected, fetchFoodList,
        foodTypeList, handleUpload, imageKey, setImageKey, previewUrl, setPreviewUrl, uploading } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (foodSelected) {
            const selectedType = foodTypeList.find(c => foodSelected.typeName === c.name);
            form.setFieldsValue({
                code: foodSelected.code,
                name: foodSelected.name,
                price: foodSelected.price,
                description: foodSelected.description,
                typeId: selectedType ? selectedType.id : null,
                imageKey: foodSelected.imageKey,
                available: foodSelected.available
            });
            setImageKey(foodSelected.imageKey || null);
            fetchUrl(foodSelected.imageKey || null);
        }
    }, [foodSelected]);

    useEffect(() => {
        if (imageKey) {
            form.setFieldsValue({ imageKey });
        }
    }, [imageKey]);

    const fetchUrl = async (key) => {
        if (key) {
            const res = await getMediaUrlAPI(key);
            if (res.data) {
                setPreviewUrl(res.data);
            }
        } else {
            setPreviewUrl(null);
        }
    }

    const handleCancel = () => {
        form.resetFields();
        setFoodSelected(null);
        setPreviewUrl(null);
        setImageKey(null);
        setIsModalUpdateOpen(false);
    };

    const onFinish = async (values) => {
        let newKey = values.imageKey; // key mới sau upload temp
        let oldKey = foodSelected.imageKey; // poster cũ

        // Nếu có image mới thì commit
        if (newKey && newKey !== oldKey) {
            const resCommit = await commitFileAPI(newKey, "foods");
            if (!resCommit.data) {
                notification.error({ message: "Commit image thất bại!" });
                return;
            }
            newKey = resCommit.data;
        } else {
            newKey = oldKey; // không đổi poster
        }

        const res = await updateFoodAPI(
            foodSelected.id,
            values.code,
            values.name,
            values.price,
            values.description,
            newKey,
            values.typeId,
            values.available
        );

        if (res.data) {
            notification.success({
                message: "Success",
                description: "Cập nhật đồ ăn thành công!"
            });

            // Nếu có ảnh mới thì xóa ảnh cũ
            if (oldKey && newKey !== oldKey) {
                await deleteFileAPI(oldKey);
            }

            handleCancel();
            fetchFoodList();
        } else {
            notification.error({
                message: "Failed",
                description: JSON.stringify(res.message)
            });
        }
    };

    return (
        <Modal
            title="Update Food"
            open={isModalUpdateOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            maskClosable={true}
            okText="UPDATE"
            width={700}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* Code */}
                <Form.Item
                    label="Food Code"
                    name="code"
                    rules={[{ required: true, message: "Vui lòng nhập mã món ăn!" }]}
                >
                    <Input placeholder="VD: FD001" />
                </Form.Item>

                {/* Name */}
                <Form.Item
                    label="Food Name"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên món ăn!" }]}
                >
                    <Input placeholder="Tên món ăn" />
                </Form.Item>

                {/* Price */}
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: "Vui lòng nhập giá món ăn!" }]}
                >
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="Nhập giá"
                        addonAfter="VNĐ"
                    />
                </Form.Item>

                {/* Description */}
                <Form.Item label="Description" name="description">
                    <Input.TextArea rows={3} placeholder="Mô tả món ăn (optional)" />
                </Form.Item>

                {/* Food Type */}
                <Form.Item
                    label="Food Type"
                    name="typeId"
                    rules={[{ required: true, message: "Vui lòng chọn loại món ăn!" }]}
                >
                    <Select
                        placeholder="Chọn loại món ăn"
                        allowClear
                        style={{ width: "100%" }}
                        options={foodTypeList.map((type) => ({
                            label: type.name,
                            value: type.id,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Image"
                >
                    <Upload
                        customRequest={handleUpload}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />} loading={uploading}>Upload Image</Button>
                    </Upload>
                    {previewUrl && (
                        <div style={{ marginTop: 8 }}>
                            <img src={previewUrl} alt="Image Preview" style={{ width: 200, borderRadius: 8 }} />
                        </div>
                    )}
                </Form.Item>
                <Form.Item name="imageKey" hidden>
                    <Input />
                </Form.Item>

                {/* Available */}
                <Form.Item name="available" valuePropName="checked" initialValue={true}>
                    <Checkbox>Available</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default FoodUpdateModal;