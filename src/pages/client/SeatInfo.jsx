const SeatInfo = ({ movie, showtime, poster }) => (
    <div className="seat-info">
        <img
            src={poster || "/default-poster.jpg"}
            alt={movie?.title || "poster"}
            className="seat-poster"
        />
        <div className="seat-details">
            <h3>{movie?.title || "Đang cập nhật"}</h3>
            <p style={{ marginTop: "10px" }} className="movie-meta">
                <strong>Thể loại:</strong> {movie?.categoryNames?.join(", ")}
            </p>
            <p>
                <strong>
                    {showtime?.cinemaName} - {showtime?.roomName}
                </strong>
            </p>
            <p>
                Suất:{" "}
                <b>
                    {new Date(showtime?.startTime).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </b>{" "}
                -{" "}
                {new Date(showtime?.endTime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </p>
            <p>Ngày chiếu: {new Date(showtime?.startTime).toLocaleDateString("vi-VN")}</p>
        </div>
    </div>
);

export default SeatInfo;
