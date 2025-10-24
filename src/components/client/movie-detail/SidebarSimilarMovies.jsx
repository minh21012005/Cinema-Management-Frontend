import React from "react";
import { Button } from "antd";
import SidebarMovieCard from "./SidebarMovieCard";

const SidebarSimilarMovies = ({ similar, similarPosters, visibleCount, onSeeMore, onClickSidebar }) => {
    return (
        <div className="sidebar">
            <h3 className="sidebar-title">PHIM TƯƠNG TỰ</h3>
            <div className="sidebar-list">
                {similar.slice(0, visibleCount).map((m) => (
                    <SidebarMovieCard
                        key={m.id}
                        movie={m}
                        poster={similarPosters[m.id]}
                        onClick={onClickSidebar}
                    />
                ))}
            </div>
            {visibleCount < similar.length && (
                <div style={{ marginTop: 18 }}>
                    <Button className="see-more-btn" block onClick={onSeeMore}>
                        Xem thêm
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SidebarSimilarMovies;
