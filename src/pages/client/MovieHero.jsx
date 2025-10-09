import React from "react";
import TrailerModal from "./trailer.modal";

const MovieHero = ({ movie, playing, setPlaying, getYouTubeThumbnail }) => {
    return (
        <div className="movie-hero">
            <div className="hero-inner" onClick={() => setPlaying(true)}>
                <img
                    src={getYouTubeThumbnail(movie.trailerUrl)}
                    alt="Trailer thumbnail"
                    className="hero-thumbnail"
                />
                <div className="play-icon-large">
                    <svg viewBox="0 0 100 100" width="46" height="46" aria-hidden>
                        <circle cx="50" cy="50" r="50" fill="#fff" opacity="0.95" />
                        <polygon points="40,30 70,50 40,70" fill="#ff7a2d" />
                    </svg>
                </div>
            </div>

            <TrailerModal
                isOpen={playing}
                onClose={() => setPlaying(false)}
                trailerUrl={movie?.trailerUrl}
            />
        </div>
    );
};

export default MovieHero;
