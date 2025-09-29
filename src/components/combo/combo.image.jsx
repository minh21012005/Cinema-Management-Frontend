import { getMediaUrlAPI } from "@/services/api.service";
import { useEffect, useState } from "react";

const ComboImage = ({ imageKey }) => {
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (imageKey) {
            getMediaUrlAPI(imageKey).then(res => setUrl(res.data));
        }
    }, [imageKey]);

    if (!imageKey) return "-";

    return (
        <img
            src={url || ""}
            alt="combo"
            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
        />
    );
};

export default ComboImage;
