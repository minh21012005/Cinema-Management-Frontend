import { Form, DatePicker, Modal, Select, notification, Input, InputNumber, Button, Row, Col, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { commitFileAPI, deleteFileAPI, getMediaUrlAPI, updateMovieAPI, uploadTempFileAPI } from "@/services/api.service";

const MovieUpdateModal = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, movieUpdateSelected,
        setMovieUpdateSelected, urlPoster, setUrlPoster, categories, loadMovie } = props;
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleCancel = () => {
        form.resetFields();
        setMovieUpdateSelected(null);
        setPreviewUrl(null);
        setIsModalUpdateOpen(false);
    };

    useEffect(() => {
        if (movieUpdateSelected) {
            const selectedCategoryIds = categories
                .filter(c => movieUpdateSelected.categoryCodes.includes(c.code)) // c.code là code của category từ API
                .map(c => c.id);
            form.setFieldsValue({
                title: movieUpdateSelected.title,
                description: movieUpdateSelected.description,
                durationInMinutes: movieUpdateSelected.durationInMinutes,
                releaseDate: movieUpdateSelected.releaseDate ? dayjs(movieUpdateSelected.releaseDate) : null,
                endDate: movieUpdateSelected.endDate ? dayjs(movieUpdateSelected.endDate) : null,
                categoryIds: selectedCategoryIds,
                posterKey: movieUpdateSelected.posterKey
            });
            setUrlPoster(movieUpdateSelected.posterKey || null);
        }
    }, [movieUpdateSelected]);

    const onFinish = async (values) => {
        let newKey = values.posterKey; // key mới sau upload temp
        let oldKey = movieUpdateSelected.posterKey; // poster cũ

        // Nếu có poster mới thì commit
        if (newKey && newKey !== oldKey) {
            const resCommit = await commitFileAPI(newKey, "movies");
            if (!resCommit.data) {
                notification.error({ message: "Commit poster thất bại!" });
                return;
            }
            newKey = resCommit.data;
        } else {
            newKey = oldKey; // không đổi poster
        }

        let release = values.releaseDate.format("YYYY-MM-DD");
        let end = values.endDate ? values.endDate.format("YYYY-MM-DD") : null;

        const res = await updateMovieAPI(
            movieUpdateSelected.id,
            values.title,
            values.description,
            values.durationInMinutes,
            release,
            end,
            newKey,
            values.categoryIds
        );

        if (res.data) {
            notification.success({
                message: "Success",
                description: "Cập nhật phim thành công!"
            });

            // Nếu có poster mới thì xóa poster cũ
            if (oldKey && newKey !== oldKey) {
                await deleteFileAPI(oldKey);
            }

            handleCancel();
            loadMovie();
        } else {
            notification.error({
                message: "Failed",
                description: JSON.stringify(res.message)
            });
        }
    };

    const handleUpload = async ({ file }) => {
        setUploading(true);
        try {
            const res = await uploadTempFileAPI(file); // call API upload file
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
            title="Update Movie"
            open={isModalUpdateOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            maskClosable={true}
            okText="UPDATE"
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
                        <Form.Item
                            label="End Date"
                            name="endDate">
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

                <Form.Item
                    label="Poster"
                    name="poster"
                >
                    <Upload
                        customRequest={handleUpload}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />} loading={uploading}>Upload Poster</Button>
                    </Upload>
                    {urlPoster && (
                        <div style={{ marginTop: 8 }}>
                            <img src={urlPoster} alt="Poster Preview" style={{ width: 200, borderRadius: 8 }} />
                        </div>
                    )}
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

export default MovieUpdateModal;
