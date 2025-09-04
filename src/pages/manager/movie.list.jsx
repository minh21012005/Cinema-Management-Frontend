import MovieTable from "@/components/movie/movie.table";
import { fetchAllMoviesAPI } from "@/services/api.service";
import { useEffect, useState } from "react";

const MovieListPage = () => {

    const [dataMovie, setDataMovie] = useState([]);
    const [current, setCurrent] = useState(1);
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
            <MovieTable
                dataMovie={dataMovie}
                loadMovie={loadMovie}
                current={current}
                pageSize={pageSize}
                total={total}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
                onChange={onChange}
                isModalOpen={isModalOpen}
            />
        </>
    )
}

export default MovieListPage;