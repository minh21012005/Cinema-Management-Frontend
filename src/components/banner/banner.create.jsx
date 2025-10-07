import { UploadOutlined } from "@ant-design/icons";
import { Form, Input, DatePicker, Checkbox, Upload, Button, notification, Modal, InputNumber } from "antd";
import { useEffect } from "react";
import { commitFileAPI, createBannerAPI } from "@/services/api.service";

const BannerModalCreate = ({
    isModalOpen,
    setIsModalOpen,
    handleUpload,
    fetchBannerList,
    uploading,
    previewUrl,
    setPreviewUrl,
    imageKey,
    setImageKey
}) => {
    const [form] = Form.useForm();

    // Cancel modal
    const handleCancel = () => {
        form.resetFields();
        setImageKey(null);
        setPreviewUrl(null);
        setIsModalOpen(false);
    };

    // Khi imageKey thay đổi, set cho form
    useEffect(() => {
        if (imageKey) {
            form.setFieldValue("imageKey", imageKey);
        }
    }, [imageKey]);

    const onFinish = async (values) => {
        if (!imageKey) {
            notification.error({ message: "Vui lòng chọn ảnh cho banner!" });
            return;
        }

        let finalImageKey = imageKey;

        // Chỉ commit nếu file chưa commit
        if (!finalImageKey.startsWith("banners/")) {
            const resCommit = await commitFileAPI(finalImageKey, "banners");
            if (!resCommit.data) {
                notification.error({ message: "Upload ảnh thất bại hoặc không có ảnh!" });
                return;
            }
            finalImageKey = resCommit.data;
            setImageKey(finalImageKey); // update state sau commit
        }

        const payload = {
            title: values.title,
            subtitle: values.subtitle,
            redirectUrl: values.redirectUrl,
            startDate: values.startDate ? values.startDate.toISOString() : null,
            endDate: values.endDate ? values.endDate.toISOString() : null,
            displayOrder: values.displayOrder,
            active: values.active,
            imageKey: finalImageKey
        };

        try {
            const res = await createBannerAPI(payload);
            if (res.data) {
                notification.success({ message: "Success", description: "Tạo banner thành công!" });
                handleCancel();
                fetchBannerList();
            } else {
                notification.error({ message: "Failed", description: JSON.stringify(res.message) });
            }
        } catch (err) {
            // Nếu tạo thất bại, giữ nguyên imageKey & previewUrl
            notification.error({ message: err.message || "Tạo banner thất bại!" });
        }
    };

    return (
        <Modal
            title="Create Banner"
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            maskClosable
            okText="CREATE"
            width={700}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Vui lòng nhập tiêu đề banner!" }]}
                >
                    <Input placeholder="Tiêu đề banner" />
                </Form.Item>

                <Form.Item label="Subtitle" name="subtitle">
                    <Input.TextArea rows={2} placeholder="Subtitle (optional)" />
                </Form.Item>

                <Form.Item label="Redirect URL" name="redirectUrl">
                    <Input placeholder="Link đến trang phim / event / external (optional)" />
                </Form.Item>

                <Form.Item label="Start Date" name="startDate">
                    <DatePicker showTime style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="End Date" name="endDate">
                    <DatePicker showTime style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Display Order"
                    name="displayOrder"
                    initialValue={1}
                >
                    <InputNumber style={{ width: "100%" }} min={1} />
                </Form.Item>

                <Form.Item label="Image" required>
                    <Upload customRequest={handleUpload} showUploadList={false}>
                        <Button icon={<UploadOutlined />} loading={uploading}>Upload Image</Button>
                    </Upload>
                    {previewUrl && (
                        <div style={{ marginTop: 8 }}>
                            <img src={previewUrl} alt="Preview" style={{ width: 200, borderRadius: 8 }} />
                        </div>
                    )}
                </Form.Item>

                <Form.Item name="active" valuePropName="checked" initialValue={true}>
                    <Checkbox>Active</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BannerModalCreate;
