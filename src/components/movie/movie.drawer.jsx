import { Drawer } from "antd";

const MovieDrawer = (props) => {

    const { isDrawerOpen, setIsDrawerOpen, movieSelected, setMovieSelected } = props;

    const onClose = () => {
        setIsDrawerOpen(false);
        setMovieSelected(null);
    }

    return (
        <>
            <Drawer
                width={"25vw"}
                title="Movie Detail"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={onClose}
                open={isDrawerOpen}
            >
                {movieSelected ? <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                    <p>ID: {movieSelected.id}</p>
                    <p>Title: {movieSelected.title}</p>
                    <p>Categories: {movieSelected.categories.join(", ")}</p>
                    <p>Duration (min): {movieSelected.durationInMinutes}</p>
                    <p>Release Date: {movieSelected.releaseDate}</p>
                    <p>End Date: {movieSelected.endDate}</p>
                    <p>Rating: {movieSelected.rating}</p>
                    <p>Description: {movieSelected.description}</p>
                    <p>Active: {movieSelected.active ? "Enabled" : "Disabled"}</p>
                </div>
                    :
                    <div></div>
                }
            </Drawer>
        </>
    )
}

export default MovieDrawer;