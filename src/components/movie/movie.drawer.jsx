import { Drawer, Descriptions, Divider } from "antd";
import dayjs from "dayjs";

const MovieDrawer = (props) => {
    const { isDrawerOpen, setIsDrawerOpen, movieSelected, setMovieSelected, urlPoster, setUrlPoster } = props;

    const onClose = () => {
        setIsDrawerOpen(false);
        setMovieSelected(null);
        setUrlPoster(null);
    };

    return (
        <Drawer
            width={"50vw"}
            title="🎬 Movie Detail"
            onClose={onClose}
            open={isDrawerOpen}
            styles={{
                body: { padding: 24, background: "#fafafa" }
            }}
        >
            {movieSelected ? (
                <div style={{ display: "flex", gap: "24px" }}>
                    {/* Thông tin phim */}
                    <div style={{ flex: 2 }}>
                        <Descriptions bordered column={1} size="middle">
                            <Descriptions.Item label="ID">{movieSelected.id}</Descriptions.Item>
                            <Descriptions.Item label="Title">{movieSelected.title}</Descriptions.Item>
                            <Descriptions.Item label="Categories">
                                {movieSelected?.categoryCodes?.length > 0
                                    ? movieSelected.categoryCodes.map((c) => c.toLowerCase()).join(", ")
                                    : "N/A"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Duration">
                                {movieSelected.durationInMinutes} min
                            </Descriptions.Item>
                            <Descriptions.Item label="Release Date">
                                {movieSelected?.releaseDate && dayjs(movieSelected.releaseDate).format("DD/MM/YYYY")}
                            </Descriptions.Item>

                            <Descriptions.Item label="End Date">
                                {movieSelected?.endDate && dayjs(movieSelected.endDate).format("DD/MM/YYYY")}
                            </Descriptions.Item>
                            <Descriptions.Item label="Description">{movieSelected.description}</Descriptions.Item>
                        </Descriptions>
                    </div>

                    {/* Poster phim */}
                    <div style={{ flex: 1, textAlign: "center", marginTop: "-5px" }}>
                        <Divider orientation="center">Poster</Divider>
                        <img
                            src={urlPoster}
                            alt="Poster"
                            style={{
                                width: "100%",
                                maxWidth: 250,
                                borderRadius: 12,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div>Không có dữ liệu phim</div>
            )}
        </Drawer>
    );
};

export default MovieDrawer;
