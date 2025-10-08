import React, { useEffect, useState } from "react";
import { Row, Col, Button, Tabs, Rate, Tag, Divider, Select, Modal } from "antd";
import "@/styles/movie-detail.css";
import Header from "@/components/layout/client/header";
import TrailerModal from "./trailer.modal";
import { useLocation } from "react-router-dom";
import { fetchShowingMoviesAPI, getMediaUrlAPI } from "@/services/api.service";

const { Option } = Select;

const MovieDetailPage = () => {

    const location = useLocation();

    const { movie } = location.state || {};
    const [poster, setPoster] = useState(null);
    const [nowShowing, setNowShowing] = useState([]);
    const [nowShowingPosters, setNowShowingPosters] = useState({});
    const [visibleCount, setVisibleCount] = useState(3);

    const handleSeeMore = () => {
        setVisibleCount(nowShowing.length); // hiện tất cả
    };

    useEffect(() => {
        console.log(movie);
        fetchPoster();
        fetchShowingMovies();
    }, []);

    const fetchPoster = async () => {
        const res = await getMediaUrlAPI(movie.posterKey);
        if (res?.data) {
            setPoster(res.data);
        }
    }

    const fetchShowingMovies = async () => {
        const res = await fetchShowingMoviesAPI(10);
        if (res?.data) {
            const filtered = res.data.filter(film => film.id !== movie.id);
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

    // fake schedule
    const schedule = [
        {
            cinema: "Galaxy Nguyễn Du",
            rooms: [
                { type: "2D Phụ Đề", times: ["10:00", "13:00", "16:30", "19:45"] },
            ],
        },
        {
            cinema: "Galaxy Sala",
            rooms: [
                { type: "2D Phụ Đề", times: ["11:00", "14:30", "18:00"] },
            ],
        },
        {
            cinema: "Galaxy Tân Bình",
            rooms: [
                { type: "2D Phụ Đề", times: ["09:45", "12:45", "15:30", "18:45"] },
            ],
        },
    ];

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

    const [activeTab] = useState("1");
    const [selectedDate] = useState("08/10");
    const [selectedArea] = useState("Toàn quốc");
    const [playing, setPlaying] = useState(false);

    return (
        <div className="movie-detail-page">
            <Header />
            {/* HERO / TRAILER */}
            <div className="movie-hero">
                <div className="hero-inner" onClick={() => setPlaying(true)}>
                    <img
                        src={getYouTubeThumbnail(movie.trailerUrl)}
                        alt="Trailer thumbnail"
                        className="hero-thumbnail"
                    />
                    <div className="play-icon-large">
                        <svg viewBox="0 0 100 100" width="46" height="46" aria-hidden>
                            <circle cx="50" cy="50" r="50" fill="#fff" opacity="0.95" />
                            <polygon points="40,30 70,50 40,70" fill="#ff7a2d" />
                        </svg>
                    </div>
                </div>

                <TrailerModal
                    isOpen={playing}
                    onClose={() => setPlaying(false)}
                    trailerUrl={movie?.trailerUrl}
                />
            </div>

            {/* MAIN CONTENT */}
            <div className="page-container">
                <Row gutter={[24, 24]}>
                    {/* left main content */}
                    <Col xs={24} lg={17}>
                        <div className="top-info">
                            <Row gutter={[24, 24]} align="middle">
                                <Col xs={9} sm={8} md={8}>
                                    <img className="poster-large" src={poster} />
                                </Col>
                                <Col xs={15} sm={16} md={16}>
                                    <div className="title-row">
                                        <h1 className="movie-title">{movie.title}</h1>
                                    </div>

                                    <div className="meta-line">
                                        <span className="meta-item">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="inline-block align-baseline mr-1">
                                                <path d="M7 0C3.13306 0 0 3.13306 0 7C0 10.8669 3.13306 14 7 14C10.8669 14 14 10.8669 14 7C14 3.13306 10.8669 0 7 0ZM7 12.6452C3.88105 12.6452 1.35484 10.119 1.35484 7C1.35484 3.88105 3.88105 1.35484 7 1.35484C10.119 1.35484 12.6452 3.88105 12.6452 7C12.6452 10.119 10.119 12.6452 7 12.6452ZM8.74435 9.69839L6.34798 7.95685C6.26048 7.89193 6.20968 7.79032 6.20968 7.68306V3.04839C6.20968 2.8621 6.3621 2.70968 6.54839 2.70968H7.45161C7.6379 2.70968 7.79032 2.8621 7.79032 3.04839V7.04798L9.67581 8.41976C9.82823 8.52984 9.85927 8.74153 9.74919 8.89395L9.21855 9.625C9.10847 9.7746 8.89677 9.80847 8.74435 9.69839Z" fill="#F58020"></path>
                                            </svg>
                                            {movie.durationInMinutes} phút</span>
                                        <span className="dot" />
                                        <span className="meta-item">
                                            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" class="inline-block align-baseline mr-1">
                                                <path d="M10.7143 1.75H9.42857V0.328125C9.42857 0.147656 9.28393 0 9.10714 0H8.03571C7.85893 0 7.71429 0.147656 7.71429 0.328125V1.75H4.28571V0.328125C4.28571 0.147656 4.14107 0 3.96429 0H2.89286C2.71607 0 2.57143 0.147656 2.57143 0.328125V1.75H1.28571C0.575893 1.75 0 2.33789 0 3.0625V12.6875C0 13.4121 0.575893 14 1.28571 14H10.7143C11.4241 14 12 13.4121 12 12.6875V3.0625C12 2.33789 11.4241 1.75 10.7143 1.75ZM10.5536 12.6875H1.44643C1.35804 12.6875 1.28571 12.6137 1.28571 12.5234V4.375H10.7143V12.5234C10.7143 12.6137 10.642 12.6875 10.5536 12.6875Z" fill="#F58020"></path>
                                            </svg>
                                            {movie.releaseDate}</span>
                                    </div>

                                    <div className="rating-row">
                                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" class="svg-inline--fa fa-star text-primary mr-1 hover:text-primary transition duration-500 ease-in-out" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                                        </svg>
                                        <div className="rating-number">
                                            <span>{movie.rating}</span> <span className="muted">({22} votes)</span>
                                        </div>
                                    </div>

                                    <div className="info-block">
                                        <div className="info-item">
                                            <span className="label">Thể loại:</span>
                                            <span className="value">{movie.categoryNames?.join(", ")}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Đạo diễn:</span>
                                            <span className="value">{movie.director ? movie.director : "Đang cập nhật"}</span>
                                        </div>

                                        <div className="info-item">
                                            <span className="label">Diễn viên:</span>
                                            <span className="value">{movie.cast ? movie.cast : "Đang cập nhật"}</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* Description */}
                        <Divider />
                        <div className="content-detail">
                            <h3 className="section-heading">Nội Dung Phim</h3>
                            <p className="description">
                                {movie.description}
                            </p>

                            {/* Lịch chiếu */}
                            <Divider />
                            <h3 className="section-heading">Lịch Chiếu</h3>

                            {/* date / filters */}
                            <div className="schedule-filters">
                                <div className="date-list">
                                    <button className="date-pill active">Hôm Nay<br /><span className="date-small">08/10</span></button>
                                    <button className="date-pill">Thứ Năm<br /><span className="date-small">09/10</span></button>
                                    <button className="date-pill">Thứ Sáu<br /><span className="date-small">10/10</span></button>
                                    <button className="date-pill">Thứ Bảy<br /><span className="date-small">11/10</span></button>
                                </div>

                                <div className="filters">
                                    <Select defaultValue={selectedArea} style={{ width: 160, marginRight: 12 }}>
                                        <Option value="Toàn quốc">Toàn quốc</Option>
                                        <Option value="HCM">HCM</Option>
                                        <Option value="HN">Hà Nội</Option>
                                    </Select>
                                    <Select defaultValue="Tất cả rạp" style={{ width: 160 }}>
                                        <Option value="all">Tất cả rạp</Option>
                                        <Option value="galaxy-nd">Galaxy Nguyễn Du</Option>
                                    </Select>
                                </div>
                            </div>

                            {/* schedule list */}
                            <div className="schedule-list">
                                {schedule.map((s) => (
                                    <div className="cinema-block" key={s.cinema}>
                                        <h4 className="cinema-name">{s.cinema}</h4>
                                        {s.rooms.map((r, idx) => (
                                            <div key={idx} className="room-block">
                                                <div className="room-type">{r.type}</div>
                                                <div className="times">
                                                    {r.times.map((t) => (
                                                        <button key={t} className="time-pill">{t}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>

                    {/* right sidebar */}
                    <Col xs={24} lg={7}>
                        <div className="sidebar">
                            <h3 className="sidebar-title">PHIM ĐANG CHIẾU</h3>
                            <div className="sidebar-list">
                                {nowShowing.slice(0, visibleCount).map((m) => (
                                    <div className="sidebar-card" key={m.id}>
                                        <img src={nowShowingPosters[m.id]} alt={m.title} />
                                        <div className="sidebar-card-body">
                                            <div className="sidebar-card-title">{m.title}</div>
                                            <div className="sidebar-card-meta">
                                                <span className="star">{m.rating}</span>
                                                <Tag className="rating-badge small">T13</Tag>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {visibleCount < nowShowing.length && (
                                <div style={{ marginTop: 18 }}>
                                    <Button className="see-more-btn" block onClick={handleSeeMore}>
                                        Xem thêm
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default MovieDetailPage;
