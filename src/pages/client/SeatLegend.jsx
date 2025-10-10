const SeatLegend = () => (
    <div className="seat-legend">
        <div className="seat-legend__group">
            <div className="seat-legend__item">
                <span className="seat-box sold" /> Ghế đã bán
            </div>
            <div className="seat-legend__item">
                <span className="seat-box selected" /> Ghế đang chọn
            </div>
        </div>

        <div className="seat-legend__group">
            <div className="seat-legend__item">
                <span className="seat-box normal" /> Ghế đơn
            </div>
            <div className="seat-legend__item">
                <span className="seat-box vip" /> Ghế VIP
            </div>
            <div className="seat-legend__item">
                <span className="seat-box couple" /> Ghế đôi
            </div>
        </div>
    </div>
);

export default SeatLegend;
