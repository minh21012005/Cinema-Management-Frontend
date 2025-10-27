import React, { useEffect, useState } from "react";
import { Divider } from "antd";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/homepage.css";
import { fetchAllBannersActiveAPI, fetchComingSoonMoviesAPI, fetchRecommendedMoviesAPI, fetchShowingMoviesAPI } from "@/services/api.service";
import BannerSection from "@/components/banner/banner.section";
import TrailerModal from "../../components/client/movie-detail/trailer.modal";
import Footer from "@/components/layout/client/footer";
import RecommendSection from "@/components/recommend/recommend.section";
import MovieTabsSection from "@/components/movie/movie.tabs.section";

const HomePage = () => {

    const [nowShowing, setNowShowing] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [bannerImages, setBannerImages] = useState([]);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [currentTrailerUrl, setCurrentTrailerUrl] = useState("");
    const [recommendedMovies, setRecommendedMovies] = useState([]);

    useEffect(() => {
        fetchComingSoonMovies();
        fetchShowingMovies();
        fetchBanners();
        fetchRecommendedMovies();
    }, []);

    const fetchRecommendedMovies = async () => {
        const res = await fetchRecommendedMoviesAPI();
        if (res?.data) {
            setRecommendedMovies(res.data);
        }
    };

    const fetchBanners = async () => {
        const res = await fetchAllBannersActiveAPI();
        if (res?.data) {
            setBannerImages(res.data);
        }
    }

    const fetchShowingMovies = async () => {
        const res = await fetchShowingMoviesAPI(20);
        if (res?.data) {
            setNowShowing(res.data);
        }
    }

    const fetchComingSoonMovies = async () => {
        const res = await fetchComingSoonMoviesAPI(20);
        if (res?.data) {
            setComingSoon(res.data);
        }
    }

    const handleWatchTrailer = (url) => {
        if (!url) return;
        setCurrentTrailerUrl(url);
        setIsTrailerOpen(true);
    };

    return (
        <>
            {/* ✅ MAIN CONTENT */}
            <div className="homepage-container">
                {/* 🎬 Banner */}
                <div className="banner-container">
                    <BannerSection banners={bannerImages} />
                </div>

                <MovieTabsSection
                    nowShowing={nowShowing}
                    comingSoon={comingSoon}
                    onWatchTrailer={handleWatchTrailer}
                />

                <RecommendSection
                    recommendedMovies={recommendedMovies}
                    onWatchTrailer={handleWatchTrailer}
                />

                {/* ✅ Modal Trailer */}
                <TrailerModal
                    isOpen={isTrailerOpen}
                    onClose={() => setIsTrailerOpen(false)}
                    trailerUrl={currentTrailerUrl}
                />

                {/* Footer */}
                <Divider />
                <Footer />
            </div>
        </>
    );
};

export default HomePage;
