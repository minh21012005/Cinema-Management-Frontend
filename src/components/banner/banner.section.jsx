import { getMediaUrlAPI } from "@/services/api.service";
import { useEffect, useRef, useState } from "react";
import { Carousel, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const BannerSection = ({ banners }) => {
    const carouselRef = useRef(null);
    const [bannerImages, setBannerImages] = useState([]);

    useEffect(() => {
        const fetchUrls = async () => {
            const urls = await Promise.all(
                banners.map(async (b) => {
                    const res = await getMediaUrlAPI(b.imageKey);
                    return { ...b, imgUrl: res.data };
                })
            );
            setBannerImages(urls);
        };
        if (banners.length > 0) fetchUrls();
    }, [banners]);

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
                    <div key={banner.id} className="banner-slide">
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
