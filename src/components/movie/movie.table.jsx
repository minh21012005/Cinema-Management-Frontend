import { EditOutlined } from "@ant-design/icons";
import { Space, Switch, Popconfirm, Table } from "antd";
import { render } from "nprogress";
import { useState } from "react";
import { Link } from "react-router-dom";
import MovieDrawer from "./movie.drawer";
// import { changeMovieStatusAPI, updateMovieApi } from "@/services/api.service"; // nếu có API

const MovieTable = (props) => {
    const { dataMovie, loadMovie, current, pageSize, total, setCurrent, setPageSize } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [movieSelected, setMovieSelected] = useState(null);

    const columns = [
        {
            title: "STT",
            render: (_, record, index) => (
                <div>{(index + 1) + (current - 1) * pageSize}</div>
            )
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text, record) => (<a onClick={() => { handleSelectMovie(record) }}>{text}</a>),
        },
        {
            title: "Category",
            dataIndex: "categories",
            key: "category",
            render: (categories) => categories.join(", "),
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
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
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
        setIsDrawerOpen(true);
    }

    const changeStatus = async (id) => {
        try {
            // await changeMovieStatusAPI(id); // gọi API đổi trạng thái
            loadMovie(); // reload lại danh sách phim
        } catch (error) {
            console.error("Failed to change movie status:", error);
        }
    };

    const handleUpdate = (id) => {
        setIsModalOpen(true);
        const movie = dataMovie.find(item => item.id === id);
        if (movie) {
            setMovieSelected(movie);
            // mở modal để sửa (tương tự CinemaTable)
        }
    };

    const onChange = (pagination) => {
        if (pagination?.current && +pagination.current !== +current) {
            setCurrent(+pagination.current);
        }
        if (pagination?.pageSize && +pagination.pageSize !== +pageSize) {
            setPageSize(+pagination.pageSize);
        }
    };

    return (
        <>
            <Table
                columns={columns}
                dataSource={dataMovie}
                rowKey="id"
                pagination={{
                    total: total,
                    current: current,
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
            />
        </>
    );
};

export default MovieTable;
