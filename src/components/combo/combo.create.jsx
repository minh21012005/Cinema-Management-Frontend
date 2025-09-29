import { commitFileAPI, createComboAPI } from "@/services/api.service";
import { UploadOutlined } from "@ant-design/icons";
import {
    Form,
    Input,
    InputNumber,
    Modal,
    Checkbox,
    notification,
    Upload,
    Button,
    Select,
} from "antd";
import { useEffect } from "react";

const ComboCreateModal = (props) => {
    const {
        isModalOpen,
        setIsModalOpen,
        handleUpload,
        fetchComboList,
        uploading,
        previewUrl,
        setPreviewUrl,
        imageKey,
        setImageKey,
        foodList
    } = props;

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
        console.log("Received values:", values);
        const resCommit = await commitFileAPI(values.imageKey, "combos");
        if (resCommit.data) {
            let newKey = resCommit.data;
            const res = await createComboAPI(
                values.name,
                values.price,
                values.description,
                newKey,
                values.available,
                values.foods
            );
            if (res.data) {
                notification.success({
                    message: "Success",
                    description: "Tạo combo thành công!",
                });
                handleCancel();
                fetchComboList();
            } else {
                notification.error({
                    message: "Failed",
                    description: JSON.stringify(res.message),
                });
            }
        } else {
            notification.error({
                message: "Failed",
                description: "Không có ảnh hoặc upload file lỗi!",
            });
        }
    };

    return (
        <Modal
            title="Create Combo"
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            maskClosable={true}
            okText="CREATE"
            width={700}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* Name */}
                <Form.Item
                    label="Combo Name"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên combo!" }]}
                >
                    <Input placeholder="Tên combo" />
                </Form.Item>

                {/* Price */}
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: "Vui lòng nhập giá combo!" }]}
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
                    <Input.TextArea rows={3} placeholder="Mô tả combo (optional)" />
                </Form.Item>

                {/* Foods */}
                <Form.List name="foods">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, "foodId"]}
                                        rules={[{ required: true, message: "Chọn món ăn!" }]}
                                        style={{ flex: 2 }}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Chọn món ăn"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                            }
                                            options={foodList.map(f => ({
                                                label: f.name,
                                                value: f.id
                                            }))}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, "quantity"]}
                                        rules={[{ required: true, message: "Nhập số lượng!" }]}
                                        style={{ flex: 1 }}
                                    >
                                        <InputNumber min={1} placeholder="Số lượng" style={{ width: "100%" }} />
                                    </Form.Item>
                                    <Button danger onClick={() => remove(name)}>Xóa</Button>
                                </div>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block>
                                    + Thêm món
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>


                {/* Image */}
                <Form.Item
                    label="Image"
                    name="image"
                    rules={[{ required: true, message: "Vui lòng chọn ảnh cho combo!" }]}
                >
                    <Upload customRequest={handleUpload} showUploadList={false}>
                        <Button icon={<UploadOutlined />} loading={uploading}>
                            Upload Image
                        </Button>
                    </Upload>
                    {previewUrl && (
                        <div style={{ marginTop: 8 }}>
                            <img
                                src={previewUrl}
                                alt="Image Preview"
                                style={{ width: 200, borderRadius: 8 }}
                            />
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

export default ComboCreateModal;
