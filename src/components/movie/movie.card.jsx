import { Button, Tag } from "antd";
import { PlayCircleFilled, StarFilled } from "@ant-design/icons";
import { getMediaUrlAPI } from "@/services/api.service";
import { useEffect, useState } from "react";
import "@/styles/homepage.css"; // ✅ Giữ nguyên CSS cũ
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie, onWatchTrailer }) => {
    const [posterUrl, setPosterUrl] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (movie.posterKey) {
            getMediaUrlAPI(movie.posterKey).then((res) => setPosterUrl(res.data));
        }
    }, [movie.posterKey]);

    const handleBooking = () => {
        console.log(movie)
        navigate(`/booking/${movie.id}`);
    };

    return (
        <div className="movie-card">
            {/* Ảnh poster */}
            <img
                src={posterUrl || "/default-poster.jpg"}
                alt={movie.title}
                className="movie-img"
            />

            {/* Hiệu ứng hover */}
            <div className="movie-hover" onClick={handleBooking}>
                <Button type="primary" className="movie-btn"
                    onClick={(e) => {
                        e.stopPropagation(); // ngăn click "bong bóng" lên div cha
                        handleBooking();
                    }}>
                    <img src="https://www.galaxycine.vn/_next/static/media/Vector-1.319a0d2b.svg"></img>
                    Mua vé
                </Button>
                <Button type="default" className="movie-btn"
                    onClick={(e) => {
                        e.stopPropagation(); // ngăn click "bong bóng" lên div cha
                        onWatchTrailer(movie.trailerUrl);
                    }}>
                    <PlayCircleFilled style={{ fontSize: 16, marginLeft: "-5px" }} />
                    Trailer
                </Button>
            </div>

            {/* Thông tin phim */}
            <div className="movie-info">
                <div onClick={handleBooking}>{movie.title}</div>
                {movie.rating && (
                    <Tag color="gold">
                        <StarFilled /> {movie.rating}
                    </Tag>
                )}
            </div>
        </div>
    );
};

export default MovieCard;
