// SidebarMovieCard.jsx
import React from "react";
import { Button } from "antd";

const SidebarMovieCard = ({ movie, poster, onClick }) => {
    return (
        <div className="sidebar-card" style={{ position: "relative" }}>
            <div
                style={{ position: "relative", width: "100%", cursor: "pointer" }}
            >
                <img
                    src={poster}
                    alt={movie.title}
                    style={{ display: "block", borderRadius: 6, width: "100%" }}
                    onClick={() => onClick(movie)}
                />

                <div
                    className="sidebar-img-hover"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(15, 15, 15, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 6,
                        opacity: 0,
                        transition: "opacity 0.3s",
                    }}
                    onClick={() => onClick(movie)}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                >
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: "#ff6600",
                            borderColor: "#ff6600",
                            color: "#fff",
                            padding: "20px"
                        }}
                    >
                        <img
                            style={{ width: "20px", marginRight: 6 }}
                            src="https://www.galaxycine.vn/_next/static/media/Vector-1.319a0d2b.svg"
                        />
                        Mua vé
                    </Button>
                </div>
            </div>

            <div className="sidebar-card-body">
                <div onClick={() => onClick(movie)} className="sidebar-card-title">{movie.title}</div>
                <div className="sidebar-card-meta">
                    <span className="star">{movie.rating}</span>
                </div>
            </div>
        </div>
    );
};

export default SidebarMovieCard;
