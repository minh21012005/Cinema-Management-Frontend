import { Form, DatePicker, Modal, Select, notification, Input, InputNumber, Button, Row, Col, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { createMovieAPI, getMediaUrlAPI, uploadFileAPI } from "@/services/api.service";

const MovieCreateModal = (props) => {
    const { isModalCreateOpen, setIsModalCreateOpen, categories, loadMovie } = props;
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleCancel = () => {
        form.resetFields();
        setPreviewUrl(null);
        setIsModalCreateOpen(false);
    };

    const onFinish = async (values) => {
        let release = values.releaseDate.format("YYYY-MM-DD");
        let end = values.endDate ? values.endDate.format("YYYY-MM-DD") : null;
        const res = await createMovieAPI(values.title, values.description,
            values.durationInMinutes, release, end, values.posterKey, values.categoryIds)
        if (res.data) {
            notification.success({
                message: "Success",
                description: "Tạo phim thành công!"
            })
            handleCancel();
            loadMovie();
        } else {
            notification.error({
                message: "Failed",
                description: JSON.stringify(res.message)
            })
        }
    };

    const handleUpload = async ({ file }) => {
        setUploading(true);
        try {
            const res = await uploadFileAPI(file, "movies"); // call API upload file
            if (res.data) {
                notification.success({
                    message: "Success",
                    description: "Upload poster thành công!",
                });
                const posterKey = res.data;
                form.setFieldValue("posterKey", posterKey);
                const urlRes = await getMediaUrlAPI(posterKey);
                setPreviewUrl(urlRes.data);
            } else {
                notification.error({
                    message: "Failed",
                    description: JSON.stringify(res.message)
                });
            }
        } catch (err) {
            notification.error({ message: err.message || "Upload poster thất bại" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal
            title="Create Movie"
            open={isModalCreateOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            maskClosable={true}
            okText="CREATE"
            width={700}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Vui lòng nhập title!" }]}
                >
                    <Input placeholder="Nhập title..." />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Vui lòng nhập description!" }]}
                >
                    <Input.TextArea rows={4} placeholder="Nhập description..." />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Duration (minutes)"
                            name="durationInMinutes"
                            rules={[{ required: true, message: "Vui lòng nhập thời lượng!" }]}
                        >
                            <InputNumber min={1} placeholder="Nhập thời lượng" style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Release Date"
                            name="releaseDate"
                            rules={[{ required: true, message: "Vui lòng chọn ngày phát hành!" }]}
                        >
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="End Date" name="endDate">
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Categories" name="categoryIds" rules={[{ required: true, message: "Vui lòng chọn category!" }]}>
                            <Select
                                mode="multiple"
                                placeholder="Chọn category"
                                options={categories?.map((c) => ({ label: c.name, value: c.id }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Poster">
                    <Upload
                        customRequest={handleUpload}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />} loading={uploading}>Upload Poster</Button>
                    </Upload>
                    {previewUrl && (
                        <div style={{ marginTop: 8 }}>
                            <img src={previewUrl} alt="Poster Preview" style={{ width: 200, borderRadius: 8 }} />
                        </div>
                    )}
                </Form.Item>
                <Form.Item name="posterKey" hidden>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MovieCreateModal;
