import { useCallback, useRef, useState, type PointerEvent } from "react";
import "./Test.scss";
import { CardLiquidGlass } from "../../components/CardLiquidGlass";
import { ButtonGroupLiquidGlass } from "../../components/ButtonGroupLiquidGlass";
import { CyberspaceBackground } from "../../components/CyberspaceBackground";
import { ButtonLiquidGlass } from "../../components/ButtonLiquidGlass";

export function Test() {
  const [position, setPosition] = useState({ x: 120, y: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;

      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
      };
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [position.x, position.y],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      setPosition({
        x: drag.originX + (event.clientX - drag.startX),
        y: drag.originY + (event.clientY - drag.startY),
      });
    },
    [],
  );

  const endDrag = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;

    if (event.currentTarget.hasPointerCapture(drag.pointerId)) {
      event.currentTarget.releasePointerCapture(drag.pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  return (
    <div className="test-page">
      <CyberspaceBackground />
      <div className="test-page__toolbar">
        <ButtonGroupLiquidGlass
          variant="slider"
          defaultValue="yes"
          glassParams={{ borderRadius: 999, edgeFalloff: 14, strength: 1.1 }}
        >
          <ButtonGroupLiquidGlass.Item value="yes">
            Yes
          </ButtonGroupLiquidGlass.Item>
          <ButtonGroupLiquidGlass.Item value="no">
            No
          </ButtonGroupLiquidGlass.Item>
        </ButtonGroupLiquidGlass>
      </div>

      <div
        className={`test-page__draggable${isDragging ? " test-page__draggable--dragging" : ""}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={() => {
          dragRef.current = null;
          setIsDragging(false);
        }}
      >
        <ButtonLiquidGlass
          style={{ width: "200px", height: "200px" }}
          glassParams={{ borderRadius: 100, edgeFalloff: 60, strength: 1.1 }}
        >
          Liquid Glass
        </ButtonLiquidGlass>
      </div>
    </div>
  );
}

export default Test;
