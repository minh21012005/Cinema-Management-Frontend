import MovieCreateModal from "@/components/movie/movie.create";
import MovieTable from "@/components/movie/movie.table";
import { fetchAllCategoryActive, fetchAllMoviesAPI } from "@/services/api.service";
import { Button, DatePicker, Input, Select } from "antd";
import { useEffect, useState } from "react";
const { Search } = Input;
const { RangePicker } = DatePicker;

const MovieListPage = () => {

    const [dataMovie, setDataMovie] = useState([]);
    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([]);
    const [titleSearch, setTitleSearch] = useState(null);
    const [categorySelected, setCategorySelected] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

    useEffect(() => {
        loadMovie();
        loadCategories();
    }, [current, pageSize, titleSearch, categorySelected, dateRange]);

    const loadMovie = async () => {
        const fromDate = dateRange?.[0] ? dateRange[0].format("YYYY-MM-DD") : null;
        const toDate = dateRange?.[1] ? dateRange[1].format("YYYY-MM-DD") : null;

        const res = await fetchAllMoviesAPI(current, pageSize, titleSearch, categorySelected, fromDate, toDate);
        if (res.data) {
            setDataMovie(res.data.result);
            setCurrent(res.data.meta.page);
            setPageSize(res.data.meta.pageSize);
            setTotal(res.data.meta.total);
        }
    };

    const loadCategories = async () => {
        const res = await fetchAllCategoryActive();
        if (res.data) {
            setCategories(res.data)
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
            setCategorySelected(value);
        } else {
            setCategorySelected(null); // nếu không có giá trị thì reset
        }
    };

    const showModal = () => {
        setIsModalCreateOpen(true)
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
                        style={{ width: 180 }}
                        options={categories.map(c => ({ label: c.name, value: c.id }))}
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
                categories={categories}
            />
            <MovieCreateModal
                loadMovie={loadMovie}
                categories={categories}
                isModalCreateOpen={isModalCreateOpen}
                setIsModalCreateOpen={setIsModalCreateOpen}
            />
        </>
    )
}

export default MovieListPage;