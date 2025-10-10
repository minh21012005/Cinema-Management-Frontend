const SeatMap = ({ seatLayouts, selectedSeats, toggleSeat }) => {
    return (
        <div className="seat-map">
            <div className="seat-map__rows">
                {Object.values(
                    seatLayouts.reduce((acc, seat) => {
                        const row = seat.name[0];
                        if (!acc[row]) acc[row] = [];
                        acc[row].push(seat);
                        return acc;
                    }, {})
                ).map((rowSeats, idx) => {
                    const rowName = rowSeats[0]?.name[0];
                    return (
                        <div key={rowName || idx} className="seat-row">
                            <div className="seat-row__label">{rowName}</div>
                            <div className="seat-row__seats">
                                {rowSeats
                                    .sort((a, b) => a.colIndex - b.colIndex)
                                    .map((seat) => (
                                        <button
                                            key={seat.id}
                                            className={`seat-btn 
                                                ${seat.seatType?.name === "Đôi" ? "seat-btn--couple" : ""} 
                                                ${seat.seatType?.name === "VIP" ? "seat-btn--vip" : ""} 
                                                ${seat.booked ? "seat-btn--sold" : ""} 
                                                ${selectedSeats.some((s) => s.id === seat.id)
                                                    ? "seat-btn--selected"
                                                    : ""
                                                } `}
                                            onClick={() => toggleSeat(seat)}
                                            disabled={seat.booked}
                                        >
                                            {seat.name.replace(/^[A-Z]/, "")}
                                        </button>
                                    ))}
                            </div>
                            <div className="seat-row__label">{rowName}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SeatMap;
