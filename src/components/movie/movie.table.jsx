import { EditOutlined } from "@ant-design/icons";
import { Space, Switch, Popconfirm, Table, notification } from "antd";
import { useState } from "react";
import MovieDrawer from "./movie.drawer";
import dayjs from "dayjs";
import { changeMovieStatusAPI, getMediaUrlAPI } from "@/services/api.service";
import MovieUpdateModal from "./movie.update";

const MovieTable = (props) => {
    const { dataMovie, loadMovie, categories, current, pageSize, total, setCurrent, setPageSize } = props;
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [movieSelected, setMovieSelected] = useState(null);
    const [movieUpdateSelected, setMovieUpdateSelected] = useState(null);
    const [urlPoster, setUrlPoster] = useState(null);

    const columns = [
        {
            title: "STT",
            render: (_, record, index) => {
                return (
                    <div>{index + 1 + current * pageSize}</div>
                )
            }
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text, record) => (<a onClick={() => { handleSelectMovie(record) }}>{text}</a>),
        },
        {
            title: "Category",
            dataIndex: "categoryNames",
            key: "category",
            render: (c) => c.join(", "),
        },
        {
            title: "Duration (min)",
            dataIndex: "durationInMinutes",
            key: "duration",
        },
        {
            title: "Release Date",
            dataIndex: "releaseDate",
            key: "releaseDate",
            render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "",
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : "",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => handleUpdate(record.id)}
                        style={{ cursor: "pointer", color: "orange" }}
                    />
                    <Popconfirm
                        title={`Xác nhận ${record.active ? "vô hiệu hóa" : "kích hoạt"} phim?`}
                        okText="Có"
                        cancelText="Không"
                        onConfirm={() => changeStatus(record.id)}
                    >
                        <Switch
                            checked={record.active}
                            checkedChildren="Enabled"
                            unCheckedChildren="Disabled"
                            onClick={(e) => e.preventDefault()} // chặn đổi ngay lập tức
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleSelectMovie = (record) => {
        setMovieSelected(record);
        fetchUrlPoster(record.posterKey)
        setIsDrawerOpen(true);
    }

    const changeStatus = async (id) => {
        try {
            const res = await changeMovieStatusAPI(id); // gọi API đổi trạng thái
            if (res.data) {
                loadMovie(); // reload lại danh sách phim
            } else {
                notification.error({
                    message: "Failed",
                    description: JSON.stringify(res.message)
                })
            }
        } catch (error) {
            console.error("Failed to change movie status:", error);
        }
    };

    const handleUpdate = (id) => {
        const movie = dataMovie.find(item => item.id === id);
        if (movie) {
            setMovieUpdateSelected(movie);
            fetchUrlPoster(movie.posterKey)
            setIsModalUpdateOpen(true);
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current) {
            const newCurrent = pagination.current - 1; // convert 1-based (Antd) -> 0-based (API)
            if (newCurrent !== current) {
                setCurrent(newCurrent);
            }
        }

        if (pagination && pagination.pageSize) {
            if (pagination.pageSize !== pageSize) {
                setPageSize(pagination.pageSize);
            }
        }
    };

    const fetchUrlPoster = async (posterKey) => {
        const res = await getMediaUrlAPI(posterKey)
        if (res.data) {
            setUrlPoster(res.data)
        }
    }

    return (
        <>
            <Table
                columns={columns}
                dataSource={dataMovie}
                rowKey="id"
                pagination={{
                    total: total,
                    current: current + 1,
                    pageSize: pageSize,
                    showTotal: (total, range) => (
                        <div>{range[0]}-{range[1]} trên {total} movies</div>
                    )
                }}
                onChange={onChange}
            />
            <MovieDrawer
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                movieSelected={movieSelected}
                setMovieSelected={setMovieSelected}
                urlPoster={urlPoster}
                setUrlPoster={setUrlPoster}
            />
            <MovieUpdateModal
                loadMovie={loadMovie}
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                movieUpdateSelected={movieUpdateSelected}
                setMovieUpdateSelected={setMovieUpdateSelected}
                urlPoster={urlPoster}
                setUrlPoster={setUrlPoster}
                categories={categories}
            />
        </>
    );
};

export default MovieTable;
