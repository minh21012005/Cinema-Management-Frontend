import { commitFileAPI, deleteFileAPI, getMediaUrlAPI, updateBannerAPI } from "@/services/api.service";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Modal, notification, Upload } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";

const BannerUpdateModal = (props) => {
    const {
        isModalUpdateOpen,
        setIsModalUpdateOpen,
        bannerSelected,
        setBannerSelected,
        handleUpload,
        uploading,
        setUploading,
        imageKey,
        setImageKey,
        previewUrl,
        setPreviewUrl,
        fetchBannerList
    } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (bannerSelected) {
            form.setFieldsValue({
                title: bannerSelected.title,
                subtitle: bannerSelected.subtitle,
                redirectUrl: bannerSelected.redirectUrl,
                startDate: bannerSelected.startDate ? dayjs(bannerSelected.startDate) : null,
                endDate: bannerSelected.endDate ? dayjs(bannerSelected.endDate) : null,
                displayOrder: bannerSelected.displayOrder,
                active: bannerSelected.active,
                imageKey: bannerSelected.imageKey
            });
            setImageKey(bannerSelected.imageKey || null);
            fetchUrl(bannerSelected.imageKey || null);
        }
    }, [bannerSelected]);

    useEffect(() => {
        if (imageKey) {
            form.setFieldsValue({ imageKey });
        }
    }, [imageKey]);

    const fetchUrl = async (key) => {
        if (key) {
            const res = await getMediaUrlAPI(key);
            setPreviewUrl(res.data || null);
        } else {
            setPreviewUrl(null);
        }
    }

    const handleCancel = () => {
        form.resetFields();
        setBannerSelected(null);
        setPreviewUrl(null);
        setImageKey(null);
        setIsModalUpdateOpen(false);
    };

    const onFinish = async (values) => {
        let newKey = values.imageKey; // key hiện tại (có thể là tạm hoặc đã commit)
        const oldKey = bannerSelected.imageKey;

        // 1. Kiểm tra bắt buộc phải có ảnh
        if (!newKey) {
            notification.error({ message: "Vui lòng chọn ảnh cho banner!" });
            return;
        }

        // 2. Commit chỉ khi key chưa commit (key tạm)
        let committedKey = newKey;
        if (!newKey.startsWith("banners/")) {
            try {
                const resCommit = await commitFileAPI(newKey, "banners");
                if (!resCommit.data) {
                    notification.error({ message: "Commit ảnh thất bại!" });
                    return;
                }
                committedKey = resCommit.data;
                setImageKey(committedKey); // update state key đã commit
            } catch (err) {
                notification.error({ message: "Commit ảnh thất bại!" });
                return;
            }
        }

        // 3. Chuẩn bị payload gửi API
        const payload = {
            ...values,
            imageKey: committedKey,
            startDate: values.startDate ? values.startDate.toISOString() : null,
            endDate: values.endDate ? values.endDate.toISOString() : null
        };

        // 4. Gọi API update
        try {
            const res = await updateBannerAPI(bannerSelected.id, payload);

            if (res.data) {
                notification.success({ message: "Success", description: "Cập nhật banner thành công!" });

                // 5. Xóa ảnh cũ nếu có thay đổi và update thành công
                if (oldKey && committedKey !== oldKey) {
                    await deleteFileAPI(oldKey);
                }

                handleCancel();
                fetchBannerList();
            } else {
                // Nếu update thất bại, giữ committedKey, không xóa ảnh
                notification.error({ message: "Failed", description: JSON.stringify(res.message) });
            }
        } catch (err) {
            notification.error({ message: err.message || "Cập nhật banner thất bại!" });
        }
    };

    return (
        <Modal
            title="Update Banner"
            open={isModalUpdateOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            maskClosable
            okText="UPDATE"
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
                    rules={[{ required: true, message: "Vui lòng nhập thứ tự hiển thị!" }]}
                >
                    <InputNumber style={{ width: "100%" }} min={1} />
                </Form.Item>

                <Form.Item label="Image">
                    <Upload customRequest={handleUpload} showUploadList={false}>
                        <Button icon={<UploadOutlined />} loading={uploading}>Upload Image</Button>
                    </Upload>
                    {previewUrl && (
                        <div style={{ marginTop: 8 }}>
                            <img src={previewUrl} alt="Preview" style={{ width: 200, borderRadius: 8 }} />
                        </div>
                    )}
                </Form.Item>

                <Form.Item name="imageKey" hidden>
                    <Input />
                </Form.Item>

                <Form.Item name="active" valuePropName="checked" initialValue={true}>
                    <Checkbox>Active</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BannerUpdateModal;
