import React, { useEffect, useState } from "react";
import { Row, Col, Button, Divider, Tabs } from "antd";
import "@/styles/homepage.css";
import Header from "@/components/layout/client/header";
import { fetchAllBannersActiveAPI, fetchComingSoonMoviesAPI, fetchShowingMoviesAPI } from "@/services/api.service";
import MovieCard from "@/components/movie/movie.card";
import BannerSection from "@/components/banner/banner.section";

const HomePage = () => {

    const [nowShowing, setNowShowing] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [bannerImages, setBannerImages] = useState([])

    useEffect(() => {
        fetchComingSoonMovies();
        fetchShowingMovies();
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        const res = await fetchAllBannersActiveAPI();
        if (res?.data) {
            setBannerImages(res.data);
        }
    }

    const fetchShowingMovies = async () => {
        const res = await fetchShowingMoviesAPI(8);
        if (res?.data) {
            setNowShowing(res.data);
        }
    }

    const fetchComingSoonMovies = async () => {
        const res = await fetchComingSoonMoviesAPI(8);
        if (res?.data) {
            setComingSoon(res.data);
        }
    }

    return (
        <>
            <Header />

            {/* ✅ MAIN CONTENT */}
            <div className="homepage-container">
                {/* 🎬 Banner */}
                <div className="banner-container">
                    <BannerSection banners={bannerImages} />
                </div>

                {/* 🎞️ Tabs for movies */}
                <Divider orientation="left" className="section-title">Phim</Divider>

                <Tabs
                    defaultActiveKey="1"
                    centered
                    items={[
                        {
                            key: "1",
                            label: "Đang Chiếu",
                            children: (
                                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                                    <Row gutter={[20, 20]} justify="start">
                                        {nowShowing.map((movie) => (
                                            <Col xs={24} sm={12} md={12} lg={6} key={movie.id}>
                                                <MovieCard movie={movie} />
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            ),
                        },
                        {
                            key: "2",
                            label: "Sắp Chiếu",
                            children: (
                                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                                    <Row gutter={[20, 20]} justify="start">
                                        {comingSoon.map((movie) => (
                                            <Col xs={24} sm={12} md={12} lg={6} key={movie.id}>
                                                <MovieCard movie={movie} />
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )
                        }
                    ]}
                />

                {/* Footer */}
                <Divider />
                <div className="footer-section">
                    <h2>Tham gia thành viên</h2>
                    <p>Nhận ưu đãi, giảm giá, và vé sớm dành riêng cho bạn!</p>
                    <Button type="primary" size="large" className="footer-btn">Đăng ký ngay</Button>
                </div>
            </div>
        </>
    );
};

export default HomePage;
