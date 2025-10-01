import { getMediaUrlAPI } from "@/services/api.service";
import { useEffect, useState } from "react";

const MovieImage = ({ posterKey, width = 160, height = 240 }) => {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (posterKey) {
            getMediaUrlAPI(posterKey).then(res => setUrl(res.data));
        }
    }, [posterKey]);

    if (!posterKey) return (
        <div
            style={{
                width,
                height,
                borderRadius: 8,
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
                fontSize: 14
            }}
        >
            No Poster
        </div>
    );

    return (
        <img
            src={url || ""}
            alt="movie"
            style={{
                width,
                height,
                objectFit: "cover",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
            }}
        />
    );
};

export default MovieImage;
