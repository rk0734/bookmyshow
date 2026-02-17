import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SeatMapProps {
  totalSeats: number;
  availableSeats: number;
  maxSelectable: number;
  onConfirm: (selectedSeats: string[]) => void;
  onBack: () => void;
}

const COLS = 12;
const GAP_AFTER = 3; // aisle after column 3 and before column 9 (0-indexed: 3 and 8)

const SeatMap = ({ totalSeats, availableSeats, maxSelectable, onConfirm, onBack }: SeatMapProps) => {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  // Generate seat layout deterministically
  const { seats, rows } = useMemo(() => {
    const totalRows = Math.ceil(totalSeats / COLS);
    const rowLabels = Array.from({ length: totalRows }, (_, i) => String.fromCharCode(65 + i));
    const filledCount = totalSeats - availableSeats;

    // Deterministic "filled" pattern based on seat index
    const filledSet = new Set<number>();
    const seed = totalSeats * 7 + availableSeats * 13;
    for (let i = 0; filledSet.size < filledCount && i < totalSeats * 3; i++) {
      const idx = ((seed + i * 37 + i * i * 3) % totalSeats);
      filledSet.add(idx);
    }

    const seatList: { id: string; row: string; col: number; filled: boolean }[] = [];
    let idx = 0;
    for (let r = 0; r < totalRows; r++) {
      for (let c = 0; c < COLS; c++) {
        if (idx < totalSeats) {
          seatList.push({
            id: `${rowLabels[r]}${c + 1}`,
            row: rowLabels[r],
            col: c + 1,
            filled: filledSet.has(idx),
          });
        }
        idx++;
      }
    }

    return { seats: seatList, rows: rowLabels.slice(0, totalRows) };
  }, [totalSeats, availableSeats]);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else if (next.size < maxSelectable) {
        next.add(seatId);
      }
      return next;
    });
  };

  const seatsByRow = useMemo(() => {
    const map = new Map<string, typeof seats>();
    seats.forEach((s) => {
      if (!map.has(s.row)) map.set(s.row, []);
      map.get(s.row)!.push(s);
    });
    return map;
  }, [seats]);

  return (
    <div className="space-y-5">
      {/* Screen indicator */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-3/4 h-2 bg-primary/60 rounded-full" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Screen</span>
      </div>

      {/* Seat grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[340px] space-y-1.5 flex flex-col items-center">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-0.5">
              <span className="w-5 text-xs text-muted-foreground font-mono text-right mr-1">{row}</span>
              {seatsByRow.get(row)?.map((seat) => {
                const isFilled = seat.filled;
                const isSelected = selectedSeats.has(seat.id);

                return (
                  <button
                    key={seat.id}
                    disabled={isFilled}
                    onClick={() => toggleSeat(seat.id)}
                    className={cn(
                      "w-6 h-6 rounded-sm text-[10px] font-mono flex items-center justify-center transition-all",
                      // Add aisle gaps
                      seat.col === 4 && "ml-3",
                      seat.col === 10 && "ml-3",
                      isFilled && "bg-muted text-muted-foreground/40 cursor-not-allowed",
                      !isFilled && !isSelected && "border-2 border-green-500 text-green-500 hover:bg-green-500/20 cursor-pointer",
                      isSelected && "bg-green-500 text-white border-2 border-green-600 scale-110"
                    )}
                    title={isFilled ? "Unavailable" : seat.id}
                  >
                    {seat.col}
                  </button>
                );
              })}
              <span className="w-5 text-xs text-muted-foreground font-mono ml-1">{row}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 border-2 border-green-500 rounded-sm" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-green-500 rounded-sm" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-muted rounded-sm" />
          <span className="text-muted-foreground">Filled</span>
        </div>
      </div>

      {/* Selection info */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          Selected: <span className="text-foreground font-semibold">{selectedSeats.size}</span> / {maxSelectable}
        </span>
        {selectedSeats.size > 0 && (
          <p className="text-primary font-medium mt-1">
            Seats: {Array.from(selectedSeats).sort().join(", ")}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button
          onClick={() => onConfirm(Array.from(selectedSeats).sort())}
          disabled={selectedSeats.size !== maxSelectable}
        >
          {selectedSeats.size === maxSelectable
            ? "Confirm Seats"
            : `Select ${maxSelectable - selectedSeats.size} more`}
        </Button>
      </div>
    </div>
  );
};

export default SeatMap;
