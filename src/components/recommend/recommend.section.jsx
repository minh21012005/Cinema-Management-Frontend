import React from "react";
import { Divider } from "antd";
import Slider from "react-slick";
import MovieCard from "@/components/movie/movie.card";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RecommendSection = ({ recommendedMovies, onWatchTrailer }) => {
    if (!recommendedMovies || recommendedMovies.length === 0) return null;

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <>
            <Divider orientation="left" className="section-title">
                Có thể bạn sẽ thích
            </Divider>

            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <Slider {...settings}>
                    {recommendedMovies.map((movie) => (
                        <div key={movie.id} style={{ padding: "0 10px" }}>
                            <MovieCard movie={movie} onWatchTrailer={onWatchTrailer} />
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    );
};

export default RecommendSection;