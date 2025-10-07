import { getMediaUrlAPI } from "@/services/api.service";
import { useEffect, useState } from "react";

const BannerImage = ({ imageKey }) => {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (imageKey) {
            getMediaUrlAPI(imageKey).then(res => setUrl(res.data));
        }
    }, [imageKey]);

    if (!imageKey) return "-";

    return (
        <div style={{ width: "100%", maxWidth: 420, height: 120, overflow: "hidden", borderRadius: 12 }}>
            <img
                src={url || ""}
                alt="banner"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // cover giữ tỷ lệ, cắt phần thừa
                    borderRadius: 12,
                    display: "block"
                }}
            />
        </div>
    );
};

export default BannerImage;
