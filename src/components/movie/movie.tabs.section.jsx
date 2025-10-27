import React, { useState } from "react";
import { Tabs, Row, Col, Button, Divider } from "antd";
import MovieCard from "@/components/movie/movie.card";

const MovieTabsSection = ({
    nowShowing,
    comingSoon,
    onWatchTrailer
}) => {
    const [visibleNowShowing, setVisibleNowShowing] = useState(8);
    const [visibleComingSoon, setVisibleComingSoon] = useState(8);

    const renderMovieGrid = (movies, visibleCount, setVisibleCount) => (
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Row gutter={[20, 20]} justify="start">
                {movies.slice(0, visibleCount).map((movie) => (
                    <Col xs={24} sm={12} md={12} lg={6} key={movie.id}>
                        <MovieCard movie={movie} onWatchTrailer={onWatchTrailer} />
                    </Col>
                ))}
            </Row>

            {movies.length > 8 && (
                <div style={{ textAlign: "center", marginTop: 24 }}>
                    <Button
                        type="default"
                        className="see-more-btn"
                        onClick={() =>
                            setVisibleCount(visibleCount === 8 ? movies.length : 8)
                        }
                    >
                        {visibleCount === 8 ? "Xem thêm" : "Thu gọn"}
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <>
            <Divider orientation="left" className="section-title">Phim</Divider>
            <Tabs
                defaultActiveKey="1"
                centered
                items={[
                    {
                        key: "1",
                        label: "Đang Chiếu",
                        children: renderMovieGrid(nowShowing, visibleNowShowing, setVisibleNowShowing),
                    },
                    {
                        key: "2",
                        label: "Sắp Chiếu",
                        children: renderMovieGrid(comingSoon, visibleComingSoon, setVisibleComingSoon),
                    },
                ]}
            />
        </>
    );
};

export default MovieTabsSection;