import { Button, Tag } from "antd";
import { StarFilled } from "@ant-design/icons";
import { getMediaUrlAPI } from "@/services/api.service";
import { useEffect, useState } from "react";
import "@/styles/homepage.css"; // ✅ Giữ nguyên CSS cũ

const MovieCard = ({ movie }) => {
    const [posterUrl, setPosterUrl] = useState(null);

    useEffect(() => {
        if (movie.posterKey) {
            getMediaUrlAPI(movie.posterKey).then((res) => setPosterUrl(res.data));
        }
    }, [movie.posterKey]);

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
                <Button type="primary" className="movie-btn">
                    Mua vé
                </Button>
                <Button type="default" className="movie-btn">
                    Chi tiết
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
