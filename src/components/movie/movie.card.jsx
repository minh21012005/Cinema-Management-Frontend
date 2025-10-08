import { Button, Tag } from "antd";
import { PlayCircleFilled, StarFilled } from "@ant-design/icons";
import { getMediaUrlAPI } from "@/services/api.service";
import { useEffect, useState } from "react";
import "@/styles/homepage.css"; // ✅ Giữ nguyên CSS cũ
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie, onWatchTrailer }) => {
    const [posterUrl, setPosterUrl] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        if (movie.posterKey) {
            getMediaUrlAPI(movie.posterKey).then((res) => setPosterUrl(res.data));
        }
    }, [movie.posterKey]);

    const handleBooking = () => {
        navigate("/booking", { state: { movie } }); // chuyền movie qua state
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
            <div className="movie-hover">
                <Button type="primary" className="movie-btn" onClick={handleBooking}>
                    <img src="https://www.galaxycine.vn/_next/static/media/Vector-1.319a0d2b.svg"></img>
                    Mua vé
                </Button>
                <Button type="default" className="movie-btn" onClick={() => onWatchTrailer(movie.trailerUrl)}>
                    <PlayCircleFilled style={{ fontSize: 16, marginLeft: "-5px" }} />
                    Trailer
                </Button>
            </div>

            {/* Thông tin phim */}
            <div className="movie-info">
                <div>{movie.title}</div>
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
