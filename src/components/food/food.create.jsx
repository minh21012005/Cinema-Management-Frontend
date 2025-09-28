import { commitFileAPI, createFoodAPI } from "@/services/api.service";
import { UploadOutlined } from "@ant-design/icons";
import { Form, Input, InputNumber, Modal, Select, Checkbox, notification, Upload, Button } from "antd";
import { useEffect, useState } from "react";

const FoodModalCreate = (props) => {
    const { isModalOpen, setIsModalOpen, handleUpload, foodTypeList, fetchFoodList,
        uploading, previewUrl, setPreviewUrl, imageKey, setImageKey } = props;
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        setImageKey(null);
        setPreviewUrl(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (imageKey) {
            form.setFieldValue("imageKey", imageKey);
        }
    }, [imageKey]);

    const onFinish = async (values) => {
        const resCommit = await commitFileAPI(values.imageKey, "foods");
        if (resCommit.data) {
            let newKey = resCommit.data;
            const res = await createFoodAPI(values.code, values.name, values.price, values.description,
                newKey, values.typeId, values.available)
            if (res.data) {
                notification.success({
                    message: "Success",
                    description: "Tạo đồ ăn thành công!"
                })
                handleCancel();
                fetchFoodList();
            } else {
                notification.error({
                    message: "Failed",
                    description: JSON.stringify(res.message)
                })
            }
        } else {
            notification.error({
                message: "Failed",
                description: "Không có ảnh hoặc up load file lỗi!"
            })
        }
    };

    return (
        <Modal
            title="Create Food"
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            maskClosable={true}
            okText="CREATE"
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
                    name="image"
                    rules={[{ required: true, message: "Vui lòng chọn ảnh cho món ăn!" }]}
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
};

export default FoodModalCreate;
