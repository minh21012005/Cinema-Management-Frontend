import ShowtimeModalCreate from "@/components/showtime/showtime.modal.create";
import ShowTimeTable from "@/components/showtime/showtime.table";
import { fetchActiveMovies, fetchRoomByCinemaAPI, fetchShowtimeByCinemaAPI } from "@/services/api.service";
import { Button, Input, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const { Search } = Input;

const ShowTimeListPage = () => {

    const { id } = useParams();
    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [titleSearch, setTitleSearch] = useState(null);
    const [roomSelected, setRoomSelected] = useState(null);
    const [roomList, setRoomList] = useState([]);
    const [movieList, setMovieList] = useState([]);
    const [dataShowtime, setDataShowtime] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchShowtimeByCinema();
        fetchRoomList();
        fetchMovieList();
    }, [current, pageSize, titleSearch, roomSelected]);

    const fetchRoomList = async () => {
        const res = await fetchRoomByCinemaAPI(id);
        if (res.data) {
            setRoomList(res.data)
        }
    }

    const fetchShowtimeByCinema = async () => {
        const res = await fetchShowtimeByCinemaAPI(id, current, pageSize, titleSearch, roomSelected);
        if (res.data) {
            setDataShowtime(res.data.result)
            setCurrent(res.data.meta.page);
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.total);
        }
    }

    const fetchMovieList = async () => {
        const res = await fetchActiveMovies();
        if (res.data) {
            setMovieList(res.data);
        }
    }

    const onSearch = (value, _e, info) => {
        if (value) {
            let trimmedValue = value.trim();
            setTitleSearch(trimmedValue);
            setCurrent(); // reset về trang đầu tiên khi tìm kiếm
        } else {
            setTitleSearch(null); // nếu không có giá trị tìm kiếm thì reset
            setCurrent(0); // reset về trang đầu tiên
        }
    }

    const handleChange = value => {
        if (value) {
            setRoomSelected(value);
        } else {
            setRoomSelected(null); // nếu không có giá trị thì reset
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '330px' }}>
                    <Space direction="vertical">
                        <Search
                            placeholder="Nhập title..."
                            allowClear
                            onSearch={onSearch}
                            style={{ width: 200 }}
                        />
                    </Space>
                    <Space wrap>
                        <Select
                            placeholder="Select room"
                            allowClear
                            onChange={handleChange}
                            style={{ width: 120 }}
                            options={roomList.map(room => ({
                                label: room.name,
                                value: room.id
                            }))}
                        />
                    </Space>
                </div>

                <Button type="primary" onClick={showModal}>
                    Create Showtime
                </Button>
            </div>
            <ShowTimeTable
                dataShowtime={dataShowtime}
                setDataShowtime={setDataShowtime}
                current={current}
                pageSize={pageSize}
                total={total}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
                fetchShowtimeByCinema={fetchShowtimeByCinema}
            />
            <ShowtimeModalCreate
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                roomList={roomList}
                movieList={movieList}
                fetchShowtimeByCinema={fetchShowtimeByCinema}
            />
        </>
    )
}

export default ShowTimeListPage;