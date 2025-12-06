import React, { useEffect, useState } from "react";
import { Rate, Input, Button, List, Avatar, Pagination, message } from "antd";
import { useRequireLogin } from "@/utils/requireLogin";
import { createRatingAPI, fetchRatingsByMovieAPI } from "@/services/api.service";
import { UserOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const MovieReviewSection = ({ fetchMovie, movieId }) => {
    const requireLogin = useRequireLogin();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState([]);
    const [current, setCurrent] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [current, movieId]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetchRatingsByMovieAPI(current, pageSize, movieId);
            if (res?.data) {
                setReviews(res.data.result);
                setCurrent(res.data.meta.page);
                setPageSize(res.data.meta.pageSize);
                setTotal(res.data.meta.total);
            }
        } catch (err) {
            console.error("Lỗi tải đánh giá:", err);
        }
        setLoading(false);
    };

    const handleSubmit = () => {
        requireLogin(async () => {
            if (!rating) {
                message.warning("Vui lòng chọn số sao!");
                return;
            }
            try {
                const res = await createRatingAPI(movieId, rating, comment);
                if (res?.data) {
                    message.success("Cảm ơn bạn đã đánh giá!");
                    setRating(0);
                    setComment("");
                    fetchReviews();
                    fetchMovie();
                } else {
                    message.warning(JSON.stringify(res.message))
                }
            } catch (err) {
                console.error("Lỗi khi gửi đánh giá:", err);
                message.error("Không thể gửi đánh giá. Vui lòng thử lại!");
            }
        });
    };

    return (
        <div className="movie-review-section">
            <h3 className="section-heading">Đánh giá phim</h3>

            {/* Form đánh giá */}
            <div className="review-form">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                    <Rate value={rating} onChange={setRating} />
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                    >
                        Gửi đánh giá
                    </Button>
                </div>
                <TextArea
                    rows={4}
                    placeholder="Viết cảm nhận của bạn..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ marginTop: 12 }}
                />
            </div>

            {/* Danh sách đánh giá */}
            {reviews.length > 0 && (
                <div className="review-list">
                    <List
                        loading={loading}
                        itemLayout="horizontal"
                        dataSource={reviews}
                        renderItem={(item) => (
                            <List.Item style={{ padding: "20px 0" }}>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    title={
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <span>{item.username || "Người dùng"}</span>
                                            <Rate disabled value={item.stars} style={{ fontSize: 14 }} />
                                        </div>
                                    }
                                    description={item.comment}
                                />
                            </List.Item>
                        )}
                    />

                    {total > pageSize && (
                        <Pagination
                            style={{ marginTop: 20, textAlign: "center" }}
                            current={current + 1}
                            total={total}
                            pageSize={pageSize}
                            onChange={(page) => {
                                setCurrent(page - 1); // AntD là 1-based, API là 0-based
                            }}
                            showSizeChanger={false}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default MovieReviewSection;
