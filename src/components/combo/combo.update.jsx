import { commitFileAPI, deleteFileAPI, getMediaUrlAPI, updateComboAPI } from "@/services/api.service";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, InputNumber, Modal, notification, Select, Upload } from "antd";
import { useEffect } from "react";

const ComboUpdateModal = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, comboSelected, setComboSelected, fetchComboList,
        foodList, handleUpload, imageKey, setImageKey, previewUrl, setPreviewUrl, uploading } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (comboSelected) {
            form.setFieldsValue({
                code: comboSelected.code,
                name: comboSelected.name,
                price: comboSelected.price,
                description: comboSelected.description,
                foods: comboSelected.foods
                    ? comboSelected.foods.map(f => ({
                        foodId: f.foodId,
                        quantity: f.quantity
                    }))
                    : [],
                imageKey: comboSelected.imageKey,
                available: comboSelected.available
            });
            console.log("comboSelected", comboSelected);
            setImageKey(comboSelected.imageKey || null);
            fetchUrl(comboSelected.imageKey || null);
        }
    }, [comboSelected, foodList]);

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
    };

    const handleCancel = () => {
        form.resetFields();
        setComboSelected(null);
        setPreviewUrl(null);
        setImageKey(null);
        setIsModalUpdateOpen(false);
    };

    const onFinish = async (values) => {
        let newKey = values.imageKey;
        let oldKey = comboSelected.imageKey;

        // Nếu có image mới thì commit
        if (newKey && newKey !== oldKey) {
            const resCommit = await commitFileAPI(newKey, "combos");
            if (!resCommit.data) {
                notification.error({ message: "Commit image thất bại!" });
                return;
            }
            newKey = resCommit.data;
        } else {
            newKey = oldKey;
        }

        const res = await updateComboAPI(
            comboSelected.id,
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
                description: "Cập nhật combo thành công!"
            });

            if (oldKey && newKey !== oldKey) {
                await deleteFileAPI(oldKey);
            }

            handleCancel();
            fetchComboList();
        } else {
            notification.error({
                message: "Failed",
                description: JSON.stringify(res.message)
            });
        }
    };

    return (
        <Modal
            title="Update Combo"
            open={isModalUpdateOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            maskClosable={true}
            okText="UPDATE"
            width={700}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* Code */}
                <Form.Item label="Combo Code" name="code">
                    <Input disabled />
                </Form.Item>

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
                {/* Foods */}
                <Form.List name="foods">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                                    {/* Select món ăn */}
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
                                                label: `${f.name} - ${f.price} VNĐ`,
                                                value: f.id
                                            }))}
                                        />
                                    </Form.Item>

                                    {/* Số lượng */}
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
                <Form.Item label="Image">
                    <Upload customRequest={handleUpload} showUploadList={false}>
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

export default ComboUpdateModal;
