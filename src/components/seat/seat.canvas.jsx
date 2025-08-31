import { Stage, Layer, Rect, Line, Text } from "react-konva";

const CELL_SIZE = 40;
const SEAT_H = 24;
const PADDING = 6;

const GRID_STROKE = "#e6e6e6";
const GRID_WIDTH = 0.6;
const STAGE_BG = "#fafafa";
const STAGE_BORDER = "1px solid #d9d9d9";

const SeatCanvas = (props) => {
    const { rows, cols, seats, onToggleSeat, seatTypes } = props;

    const stageSize = {
        w: cols * CELL_SIZE + 40,
        h: rows * CELL_SIZE + 40
    };

    const offsetX = 40;
    const offsetY = 40;

    return (
        <Stage
            width={stageSize.w}
            height={stageSize.h}
            style={{
                margin: "16px auto",
                border: STAGE_BORDER,
                borderRadius: 8,
                background: STAGE_BG,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
        >
            <Layer>
                {/* Grid */}
                {Array.from({ length: rows + 1 }).map((_, r) => (
                    <Line
                        key={`h-${r}`}
                        points={[
                            offsetX, r * CELL_SIZE + offsetY,
                            offsetX + cols * CELL_SIZE, r * CELL_SIZE + offsetY
                        ]}
                        stroke={GRID_STROKE}
                        strokeWidth={GRID_WIDTH}
                    />
                ))}
                {Array.from({ length: cols + 1 }).map((_, c) => (
                    <Line
                        key={`v-${c}`}
                        points={[
                            c * CELL_SIZE + offsetX, offsetY,
                            c * CELL_SIZE + offsetX, offsetY + rows * CELL_SIZE
                        ]}
                        stroke={GRID_STROKE}
                        strokeWidth={GRID_WIDTH}
                    />
                ))}

                {/* Row labels (A, B, C...) */}
                {Array.from({ length: rows }).map((_, r) => (
                    <Text
                        key={`row-${r}`}
                        text={String.fromCharCode(65 + r)} // A=65
                        x={offsetX - 24}  // ra ngoài lề trái
                        y={r * CELL_SIZE + offsetY + CELL_SIZE / 2 - 8}
                        fontSize={14}
                        fill="#444"
                    />
                ))}

                {/* Column labels (1, 2, 3...) */}
                {Array.from({ length: cols }).map((_, c) => (
                    <Text
                        key={`col-${c}`}
                        text={(c + 1).toString()}
                        x={c * CELL_SIZE + offsetX + CELL_SIZE / 2 - 6}
                        y={offsetY - 24}  // ra ngoài phía trên
                        fontSize={14}
                        fill="#444"
                    />
                ))}

                {/* Cells click area */}
                {Array.from({ length: rows }).map((_, r) =>
                    Array.from({ length: cols }).map((_, c) => (
                        <Rect
                            key={`cell-${r}-${c}`}
                            x={c * CELL_SIZE + offsetX}
                            y={r * CELL_SIZE + offsetY}
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
                            x={s.col * CELL_SIZE + offsetX + PADDING}
                            y={s.row * CELL_SIZE + offsetY + (CELL_SIZE - SEAT_H) / 2}
                            width={s.span * CELL_SIZE - 2 * PADDING}
                            height={SEAT_H}
                            fill={t.fill}
                            stroke={t.stroke}
                            strokeWidth={1.4}
                            cornerRadius={8}
                            shadowBlur={4}
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
