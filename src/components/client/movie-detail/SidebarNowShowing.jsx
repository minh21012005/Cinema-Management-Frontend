import React from "react";
import { Button } from "antd";
import SidebarMovieCard from "./SidebarMovieCard";

const SidebarNowShowing = ({ nowShowing, nowShowingPosters, visibleCount, onSeeMore, onClickSidebar }) => {
    return (
        <div className="sidebar">
            <h3 className="sidebar-title">PHIM ĐANG CHIẾU</h3>
            <div className="sidebar-list">
                {nowShowing.slice(0, visibleCount).map((m) => (
                    <SidebarMovieCard
                        key={m.id}
                        movie={m}
                        poster={nowShowingPosters[m.id]}
                        onClick={onClickSidebar}
                    />
                ))}
            </div>
            {visibleCount < nowShowing.length && (
                <div style={{ marginTop: 18 }}>
                    <Button className="see-more-btn" block onClick={onSeeMore}>
                        Xem thêm
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SidebarNowShowing;
