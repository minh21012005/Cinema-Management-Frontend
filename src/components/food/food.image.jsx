import { getMediaUrlAPI } from "@/services/api.service";
import { useEffect, useState } from "react";

const FoodImage = ({ imageKey }) => {
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
            alt="food"
            style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
        />
    );
};

export default FoodImage;
