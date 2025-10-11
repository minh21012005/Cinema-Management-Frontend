import { Modal } from "antd";
import ReactPlayer from "react-player";

const TrailerModal = ({ isOpen, onClose, trailerUrl }) => {
    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width="85vw"
            centered
            destroyOnClose
            styles={{
                content: {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    padding: 0,
                },
                body: {
                    padding: 0,
                },
            }}
        >
            <div
                style={{
                    borderRadius: "5px",
                    overflow: "hidden",
                    width: "100%",
                    maxHeight: "80vh",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                }}
            >
                <ReactPlayer
                    src={trailerUrl}
                    width="100%"
                    height="80vh"
                    controls
                    playing
                />
            </div>
        </Modal>
    );
};

export default TrailerModal;
