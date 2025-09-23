import MovieTable from "@/components/movie/movie.table";
import { fetchAllMoviesAPI } from "@/services/api.service";
import { Button, DatePicker, Input, Select } from "antd";
import { useEffect, useState } from "react";
const { Search } = Input;
const { RangePicker } = DatePicker;

const MovieListPage = () => {

    const [dataMovie, setDataMovie] = useState([]);
    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [movieSelected, setMovieSelected] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadMovie();
    }, [current, pageSize]);

    const loadMovie = async () => {
        const res = await fetchAllMoviesAPI(current, pageSize);
        if (res.data) {
            setDataMovie(res.data.result);
            setCurrent(res.data.meta.page);
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.total);
        }
    };

    const onSearch = (value, _e, info) => {

    }

    const handleChange = value => {

    };

    const showModal = () => {
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', flex: 1, gap: '10px', alignItems: 'center' }}>
                    <Search
                        placeholder="Nhập title..."
                        allowClear
                        onSearch={onSearch}
                        style={{ width: 200 }}
                    />

                    <Select
                        placeholder="Select category"
                        allowClear
                        onChange={handleChange}
                        style={{ width: 150 }}
                    // options={roomList.map(room => ({ label: room.name, value: room.id }))}
                    />

                    <RangePicker
                        format="YYYY-MM-DD"
                        onChange={(values) => setDateRange(values)}
                    />
                </div>

                <Button type="primary" onClick={showModal}>
                    Create Movie
                </Button>
            </div>
            <MovieTable
                dataMovie={dataMovie}
                loadMovie={loadMovie}
                current={current}
                pageSize={pageSize}
                total={total}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
                isModalOpen={isModalOpen}
            />
        </>
    )
}

export default MovieListPage;