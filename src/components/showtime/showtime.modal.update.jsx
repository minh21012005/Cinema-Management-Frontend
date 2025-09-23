import { updateShowtimeAPI } from "@/services/api.service";
import { Form, DatePicker, Modal, Select, notification } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

const ShowtimeModalUpdate = (props) => {

    const { isModalUpdateOpen, setIsModalUpdateOpen, roomList, movieList,
        showTimeSelected, setShowtimeSelected, fetchShowtimeByCinema } = props;
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        setShowtimeSelected(null);
        setIsModalUpdateOpen(false);
    };

    useEffect(() => {
        if (showTimeSelected) {
            form.setFieldsValue({
                roomId: showTimeSelected.roomId,
                movieId: showTimeSelected.movieId,
                startTime: showTimeSelected.startTime ? dayjs(showTimeSelected.startTime) : null,
            });
        }
    }, [showTimeSelected]);

    const onFinish = async (value) => {
        let start = value.startTime.format("YYYY-MM-DDTHH:mm:ss");
        const res = await updateShowtimeAPI(showTimeSelected.id, value.roomId, value.movieId, start);
        if (res.data) {
            notification.success({
                message: "Success",
                description: "Cập nhật suất chiếu thành công!"
            })
            handleCancel();
            fetchShowtimeByCinema();
        } else {
            notification.error({
                message: "Failed",
                description: JSON.stringify(res.message)
            })
        }
    };

    return (
        <Modal
            title="Update Showtime"
            open={isModalUpdateOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            maskClosable={true}
            okText="UPDATE"
            width={700}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* Select Room */}
                <Form.Item
                    label="Room"
                    name="roomId"
                    rules={[{ required: true, message: "Vui lòng chọn phòng chiếu!" }]}
                >
                    <Select
                        placeholder="Select room"
                        allowClear
                        style={{ width: "100%" }}
                        options={roomList.map((room) => ({
                            label: room.name,
                            value: room.id,
                        }))}
                    />
                </Form.Item>

                {/* Start time */}
                <Form.Item
                    label="Start Time"
                    name="startTime"
                    rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu!" }]}
                >
                    <DatePicker
                        showTime
                        style={{ width: "100%" }}
                        disabledDate={(current) => current && current < dayjs()} // chặn quá khứ
                    />
                </Form.Item>

                {/* Movie */}
                <Form.Item
                    label="Movie"
                    name="movieId"
                    rules={[{ required: true, message: "Vui lòng chọn phim!" }]}
                >
                    <Select
                        showSearch
                        placeholder="Select movie"
                        allowClear
                        style={{ width: "100%" }}
                        optionFilterProp="label" // quan trọng: filter theo label (tên phim)
                        options={movieList.map((movie) => ({
                            label: movie.title,
                            value: movie.id,
                        }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ShowtimeModalUpdate;