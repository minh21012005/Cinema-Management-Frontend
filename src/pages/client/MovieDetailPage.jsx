import React, { useEffect, useState } from "react";
import { Row, Col, Select, Spin } from "antd";
import "@/styles/movie-detail.css";
import { useNavigate, useParams } from "react-router-dom";
import { fetchActiveCinemasAPI, fetchMovieByIdAPI, fetchShowingMoviesAPI, fetchShowtimeByMovieAPI, getMediaUrlAPI } from "@/services/api.service";
import MovieHero from "./MovieHero";
import SidebarNowShowing from "./SidebarNowShowing";
import MovieInfo from "./MovieInfo";

const MovieDetailPage = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState({});
    const [poster, setPoster] = useState(null);
    const [nowShowing, setNowShowing] = useState([]);
    const [nowShowingPosters, setNowShowingPosters] = useState({});
    const [visibleCount, setVisibleCount] = useState(3);
    const [showtimes, setShowtimes] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [selectedCinema, setSelectedCinema] = useState("all");
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // yyyy-MM-dd
    });
    const [dateList, setDateList] = useState([]);

    useEffect(() => {
        const dates = [];
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0]; // yyyy-MM-dd

        // Map số thứ (0 = Chủ nhật) sang tên đầy đủ tiếng Việt
        const weekdayMap = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);

            const value = d.toISOString().split("T")[0]; // yyyy-MM-dd
            const dayNumber = d.getDate().toString().padStart(2, "0");
            const monthNumber = (d.getMonth() + 1).toString().padStart(2, "0");

            // Nếu là hôm nay thì label là "Hôm Nay"
            const weekday = value === todayStr ? "Hôm Nay" : weekdayMap[d.getDay()];
            const label = `${weekday}\n${dayNumber}/${monthNumber}`;

            dates.push({ label, value });
        }
        setDateList(dates);
        fetchCinemas();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // bắt đầu loading
            await fetchMovie();
            await fetchShowingMovies();
            fetchShowtime(selectedDate);
            setLoading(false); // kết thúc loading
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (selectedDate && selectedCinema) {
            fetchShowtime(selectedDate, selectedCinema);
        }
    }, [selectedDate, selectedCinema]);

    useEffect(() => {
        if (movie.posterKey) {
            fetchPoster();
        }
    }, [movie.posterKey]);

    const fetchMovie = async () => {
        const res = await fetchMovieByIdAPI(id);
        if (res?.data) {
            setMovie(res.data);
        }
    }

    const handleSeeMore = () => {
        setVisibleCount(nowShowing.length);
    };

    const fetchPoster = async () => {
        const res = await getMediaUrlAPI(movie.posterKey);
        if (res?.data) {
            setPoster(res.data);
        }
    }

    const handleClickSidebar = (film) => {
        navigate(`/booking/${film.id}`);
    }

    const fetchShowingMovies = async () => {
        const res = await fetchShowingMoviesAPI(10);
        if (res?.data) {
            const filtered = res.data.filter(film => film.id !== Number(id));
            setNowShowing(filtered);

            const posters = {};
            await Promise.all(
                filtered.map(async (film) => {
                    const posterRes = await getMediaUrlAPI(film.posterKey);
                    if (posterRes?.data) posters[film.id] = posterRes.data;
                })
            );
            setNowShowingPosters(posters);
        }
    }

    const fetchShowtime = async (date, cinemaId = selectedCinema) => {
        const params = {};
        if (date) params.date = date;
        if (cinemaId && cinemaId !== "all") params.cinemaId = cinemaId;

        const res = await fetchShowtimeByMovieAPI(id, params);
        if (res?.data) {
            setShowtimes(res.data);
        }
    };

    const fetchCinemas = async () => {
        const res = await fetchActiveCinemasAPI();
        if (res?.data) {
            setCinemas(res.data);
        }
    }

    const getScheduleByCinema = () => {
        // Nhóm showtime theo cinema
        const cinemasMap = {};

        showtimes.forEach((s) => {
            const cinemaName = s.cinemaName || "Unknown Cinema";
            const roomName = s.roomName || "Unknown Room";
            const time = new Date(s.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

            if (!cinemasMap[cinemaName]) cinemasMap[cinemaName] = {};
            if (!cinemasMap[cinemaName][roomName]) cinemasMap[cinemaName][roomName] = [];

            // Thay vì chỉ lưu time, lưu cả object chứa time + showtime gốc
            cinemasMap[cinemaName][roomName].push({
                time,
                showtime: s,
            });
        });

        // Chuyển map sang mảng để render
        return Object.entries(cinemasMap).map(([cinema, rooms]) => ({
            cinema,
            rooms: Object.entries(rooms).map(([roomName, times]) => ({
                type: roomName,
                times: times.sort(), // sắp xếp giờ tăng dần
            }))
        }));
    };

    // Tách ID từ link YouTube
    const getYouTubeThumbnail = (url) => {
        if (url) {
            const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            const match = url.match(regExp);
            return match && match[7].length === 11
                ? `https://img.youtube.com/vi/${match[7]}/maxresdefault.jpg`
                : null;
        }
    };

    return (
        <>
            {loading ? (
                <div className="loading-container">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="movie-detail-page">
                    <MovieHero movie={movie} playing={playing} setPlaying={setPlaying} getYouTubeThumbnail={getYouTubeThumbnail} />
                    <div className="page-container">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} lg={19}>
                                <MovieInfo
                                    movie={movie}
                                    poster={poster}
                                    dateList={dateList}
                                    selectedDate={selectedDate}
                                    setSelectedDate={setSelectedDate}
                                    selectedCinema={selectedCinema}
                                    setSelectedCinema={setSelectedCinema}
                                    cinemas={cinemas}
                                    getScheduleByCinema={getScheduleByCinema}
                                />
                            </Col>
                            <Col xs={24} lg={5}>
                                <SidebarNowShowing
                                    nowShowing={nowShowing}
                                    nowShowingPosters={nowShowingPosters}
                                    visibleCount={visibleCount}
                                    onSeeMore={handleSeeMore}
                                    onClickSidebar={handleClickSidebar}
                                />
                            </Col>
                        </Row>
                    </div>
                </div>
            )}
        </>
    );
};

export default MovieDetailPage;
