// src/components/common/ClientImage.jsx
import { useEffect, useState } from "react";
import { getMediaUrlAPI } from "@/services/api.service";

const ClientImage = ({ imageKey, alt = "image", maxWidth = 100, maxHeight = 100 }) => {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (imageKey) {
            getMediaUrlAPI(imageKey)
                .then((res) => {
                    setUrl(res?.data || null);
                })
                .catch(() => setUrl(null));
        }
    }, [imageKey]);

    if (!url) {
        return (
            <div
                style={{
                    width: maxWidth,
                    height: maxHeight,
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                }}
            >
                <span style={{ color: "#aaa", fontSize: 12 }}>No image</span>
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={alt}
            style={{
                maxWidth: maxWidth,
                maxHeight: maxHeight,
                objectFit: "cover",
                borderRadius: 8,
            }}
        />
    );
};

export default ClientImage;
