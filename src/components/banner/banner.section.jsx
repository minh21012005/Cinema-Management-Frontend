import { getMediaUrlAPI } from "@/services/api.service";
import { useEffect, useRef, useState } from "react";
import { Carousel, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const BannerSection = ({ banners }) => {
    const carouselRef = useRef(null);
    const [bannerImages, setBannerImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUrls = async () => {
            // Sắp xếp theo displayOrder tăng dần
            const sortedBanners = [...banners].sort((a, b) => a.displayOrder - b.displayOrder);

            const urls = await Promise.all(
                sortedBanners.map(async (b) => {
                    const res = await getMediaUrlAPI(b.imageKey);
                    return { ...b, imgUrl: res.data };
                })
            );
            setBannerImages(urls);
        };
        if (banners.length > 0) fetchUrls();
    }, [banners]);

    const handleBannerClick = (url) => {
        if (!url) return;
        if (url.startsWith("/")) {
            navigate(url);
        } else {
            window.open(url, "_blank");
        }
    };

    if (!bannerImages.length) return null;

    return (
        <div className="banner-container">
            <Carousel
                infinite
                autoplay
                ref={carouselRef}
                dots={{ className: "custom-dots" }}
                autoplaySpeed={4000}
                speed={800}
            >
                {bannerImages.map((banner, index) => (
                    <div
                        onClick={() => handleBannerClick(banner.redirectUrl)}
                        key={banner.id}
                        className="banner-slide">
                        <img src={banner.imgUrl} alt={banner.title} className="banner-image" />
                        <div className="banner-overlay">
                            <div className="banner-text">
                                <h2>{banner.title}</h2>
                                <p>{banner.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>

            {/* Nút điều hướng */}
            <Button shape="circle" icon={<LeftOutlined />} className="banner-nav-btn left"
                onClick={() => carouselRef.current.prev()} />
            <Button shape="circle" icon={<RightOutlined />} className="banner-nav-btn right"
                onClick={() => carouselRef.current.next()} />
        </div>
    );
};

export default BannerSection;
