import React, { useRef } from "react";
import { Carousel, Row, Col, Card, Button, Tag, Divider, Tabs } from "antd";
import { StarFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import "@/styles/homepage.css";
import banner1 from "@/assets/banner/banner1.jpg";
import banner2 from "@/assets/banner/banner2.jpg";
import banner3 from "@/assets/banner/banner3.jpg";

const { Meta } = Card;

const HomePage = () => {
    const carouselRef = useRef(null);

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

    const nowShowing = [
        { id: 1, title: "Avengers: Endgame", poster: "https://img.cgv.co.kr/Movie/Thumbnail/Poster/000083/83277/83277_320.jpg", rating: 9.2 },
        { id: 2, title: "Spider-Man: No Way Home", poster: "https://resizing.flixster.com/8PNiwC2bpe9OecfYZSOVkvYC5vk=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzL2U5NGM0Y2Q1LTAyYTItNGFjNC1hNWZhLWMzYjJjOTdjMTFhOS5qcGc=", rating: 8.7 },
        { id: 3, title: "The Batman", poster: "https://img.cgv.co.kr/Movie/Thumbnail/Poster/000085/85815/85815_320.jpg", rating: 8.3 },
        { id: 4, title: "Doctor Strange 2", poster: "https://img.cgv.co.kr/Movie/Thumbnail/Poster/000085/85844/85844_320.jpg", rating: 8.5 }
    ];

    const comingSoon = [
        { id: 1, title: "Avatar 3", poster: "https://img.cgv.co.kr/Movie/Thumbnail/Poster/000085/85852/85852_320.jpg", releaseDate: "2025-12-20" },
        { id: 2, title: "Fantastic Beasts 4", poster: "https://img.cgv.co.kr/Movie/Thumbnail/Poster/000083/83305/83305_320.jpg", releaseDate: "2026-01-10" }
    ];

    return (
        <>
            {/* ✅ HEADER */}
            <header className="site-header">
                <img className="header-logo" src="/logo.svg" alt="logo" />
                <nav className="header-nav">
                    <a href="#">Trang chủ</a>
                    <a href="#">Phim</a>
                    <a href="#">Lịch chiếu</a>
                    <a href="#">Ưu đãi</a>
                    <a href="#">Liên hệ</a>
                </nav>
                <div className="header-actions">
                    <a href="#" className="login-link">Đăng nhập</a>
                </div>
            </header>

            {/* ✅ MAIN CONTENT */}
            <div className="homepage-container">
                {/* 🎬 Banner */}
                <div className="banner-container">
                    <Carousel
                        infinite
                        autoplay
                        ref={carouselRef}
                        effect="scrollx"
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
                                <Row gutter={[20, 20]}>
                                    {nowShowing.map((movie) => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={movie.id}>
                                            <div className="movie-card">
                                                <img src={movie.poster} alt={movie.title} className="movie-img" />
                                                <div className="movie-hover">
                                                    <Button type="primary" className="movie-btn">Mua vé</Button>
                                                    <Button type="default" className="movie-btn">Chi tiết</Button>
                                                </div>
                                                <div className="movie-info">
                                                    <div>{movie.title}</div>
                                                    <Tag color="gold"><StarFilled /> {movie.rating}</Tag>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            )
                        },
                        {
                            key: "2",
                            label: "Sắp Chiếu",
                            children: (
                                <Row gutter={[20, 20]}>
                                    {comingSoon.map((movie) => (
                                        <Col xs={24} sm={12} md={8} lg={6} key={movie.id}>
                                            <div className="movie-card">
                                                <img src={movie.poster} alt={movie.title} className="movie-img" />
                                                <div className="movie-hover">
                                                    <Button type="primary" className="movie-btn">Nhắc tôi</Button>
                                                    <Button type="default" className="movie-btn">Chi tiết</Button>
                                                </div>
                                                <div className="movie-info">
                                                    <h4>{movie.title}</h4>
                                                    <p>Khởi chiếu: {movie.releaseDate}</p>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
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
