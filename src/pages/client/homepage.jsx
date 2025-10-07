import React, { useEffect, useRef, useState } from "react";
import { Carousel, Row, Col, Card, Button, Tag, Divider, Tabs } from "antd";
import { StarFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import "@/styles/homepage.css";
import banner1 from "@/assets/banner/banner1.jpg";
import banner2 from "@/assets/banner/banner2.jpg";
import banner3 from "@/assets/banner/banner3.jpg";
import Header from "@/components/layout/client/header";
import { fetchComingSoonMoviesAPI, fetchShowingMoviesAPI } from "@/services/api.service";
import MovieCard from "@/components/movie/movie.card";

const HomePage = () => {

    const carouselRef = useRef(null);
    const [nowShowing, setNowShowing] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);

    const bannerImages = [
        {
            img: banner1,
            title: "Inside Out 2",
            subtitle: "Một hành trình cảm xúc đầy màu sắc – Đang chiếu tại tất cả các rạp!"
        },
        {
            img: banner2,
            title: "Bad Boys 4",
            subtitle: "Will Smith trở lại cùng những pha hành động mãn nhãn!"
        },
        {
            img: banner3,
            title: "Kingdom of the Planet of the Apes",
            subtitle: "Sự trỗi dậy của một đế chế mới – Đừng bỏ lỡ!"
        }
    ];

    useEffect(() => {
        fetchComingSoonMovies();
        fetchShowingMovies();
    }, []);

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
                    <Carousel
                        infinite
                        autoplay
                        ref={carouselRef}
                        dots={{ className: "custom-dots" }}
                        autoplaySpeed={4000}
                        speed={800}
                    >
                        {bannerImages.map((banner, index) => (
                            <div key={index} className="banner-slide">
                                <img src={banner.img} alt={`banner-${index}`} className="banner-image" />
                                <div className="banner-overlay">
                                    <div className="banner-text">
                                        <h2>{banner.title}</h2>
                                        <p>{banner.subtitle}</p>
                                        <Button type="primary" size="large" className="banner-book-btn">
                                            Đặt vé ngay
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>

                    {/* Nút điều hướng */}
                    <Button
                        shape="circle"
                        icon={<LeftOutlined />}
                        className="banner-nav-btn left"
                        onClick={() => carouselRef.current.prev()}
                    />
                    <Button
                        shape="circle"
                        icon={<RightOutlined />}
                        className="banner-nav-btn right"
                        onClick={() => carouselRef.current.next()}
                    />
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
