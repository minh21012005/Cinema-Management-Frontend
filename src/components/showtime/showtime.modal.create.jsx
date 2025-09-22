import { createShowtimeAPI } from "@/services/api.service";
import { Form, DatePicker, Modal, Select, notification } from "antd";
import dayjs from "dayjs";

const ShowtimeModalCreate = (props) => {
    const { isModalOpen, setIsModalOpen, roomList, movieList, fetchShowtimeByCinema } = props;
    const [form] = Form.useForm();

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = async (value) => {
        let start = value.startTime.format("YYYY-MM-DDTHH:mm:ss");
        const res = await createShowtimeAPI(value.roomId, value.movieId, start);
        if (res.data) {
            notification.success({
                message: "Success",
                description: "Tạo suất chiếu thành công!"
            })
            fetchShowtimeByCinema();
            handleCancel();
        } else {
            notification.error({
                message: "Failed",
                description: JSON.stringify(res.message)
            });
        }
    };

    return (
        <Modal
            title="Create Showtime"
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            maskClosable={true}
            okText="CREATE"
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
    );
};

export default ShowtimeModalCreate;
