// SeatCanvas.jsx
import { Stage, Layer, Rect, Line } from "react-konva";

const CELL_SIZE = 56;
const SEAT_H = 32;
const PADDING = 6;

// Style mới
const GRID_STROKE = "#e6e6e6";   // grid nhẹ, sáng
const GRID_WIDTH = 0.6;          // mỏng hơn, đỡ rối
const STAGE_BG = "#fafafa";      // nền canvas dịu mắt
const STAGE_BORDER = "1px solid #d9d9d9"; // viền nhẹ, chuyên nghiệp

const SeatCanvas = (props) => {
    const { rows, cols, seats, onToggleSeat, seatTypes } = props;

    const stageSize = { w: cols * CELL_SIZE, h: rows * CELL_SIZE };

    return (
        <Stage
            width={stageSize.w}
            height={stageSize.h}
            style={{
                margin: "16px auto",
                border: STAGE_BORDER,
                borderRadius: 8,       // bo góc stage
                background: STAGE_BG,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // đổ bóng nhẹ
            }}
        >
            <Layer>
                {/* Grid */}
                {Array.from({ length: rows + 1 }).map((_, r) => (
                    <Line
                        key={`h-${r}`}
                        points={[0, r * CELL_SIZE, stageSize.w, r * CELL_SIZE]}
                        stroke={GRID_STROKE}
                        strokeWidth={GRID_WIDTH}
                    />
                ))}
                {Array.from({ length: cols + 1 }).map((_, c) => (
                    <Line
                        key={`v-${c}`}
                        points={[c * CELL_SIZE, 0, c * CELL_SIZE, stageSize.h]}
                        stroke={GRID_STROKE}
                        strokeWidth={GRID_WIDTH}
                    />
                ))}

                {/* Cells click area (transparent) */}
                {Array.from({ length: rows }).map((_, r) =>
                    Array.from({ length: cols }).map((_, c) => (
                        <Rect
                            key={`cell-${r}-${c}`}
                            x={c * CELL_SIZE}
                            y={r * CELL_SIZE}
                            width={CELL_SIZE}
                            height={CELL_SIZE}
                            fill="transparent"
                            onClick={() => onToggleSeat(r, c)}
                        />
                    ))
                )}

                {/* Seats */}
                {seats.map((s) => {
                    const t = seatTypes[s.type];
                    return (
                        <Rect
                            key={s.id}
                            x={s.col * CELL_SIZE + PADDING}
                            y={s.row * CELL_SIZE + (CELL_SIZE - SEAT_H) / 2}
                            width={s.span * CELL_SIZE - 2 * PADDING}
                            height={SEAT_H}
                            fill={t.fill}
                            stroke={t.stroke}
                            strokeWidth={1.4}   // viền mảnh hơn
                            cornerRadius={8}   // bo cong mềm mại hơn
                            shadowBlur={4}     // bóng nhẹ cho ghế
                            shadowColor="rgba(0,0,0,0.15)"
                            onClick={() => onToggleSeat(s.row, s.col)}
                        />
                    );
                })}
            </Layer>
        </Stage>
    );
};

export default SeatCanvas;
