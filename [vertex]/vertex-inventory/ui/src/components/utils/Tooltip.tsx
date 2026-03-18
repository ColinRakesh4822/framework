import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store';
import SlotTooltip from '../inventory/SlotTooltip';

const Tooltip: React.FC = () => {
  const hoverData = useAppSelector((state) => state.tooltip);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!hoverData.open || !hoverData.item || !hoverData.inventoryType) {
    return null;
  }

  const getTooltipPosition = () => {
    const offset = 10;
    const tooltipWidth = 200;
    const tooltipHeight = 100;

    let x = mousePosition.x + offset;
    let y = mousePosition.y - offset;

    if (x + tooltipWidth > window.innerWidth) {
      x = mousePosition.x - tooltipWidth - offset;
    }
    if (y + tooltipHeight > window.innerHeight) {
      y = mousePosition.y - tooltipHeight - offset;
    }
    if (y < 0) {
      y = mousePosition.y + offset;
    }

    return { x, y };
  };

  const position = getTooltipPosition();

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        pointerEvents: 'none',
      }}
    >
      <SlotTooltip item={hoverData.item} inventoryType={hoverData.inventoryType} style={{}} />
    </div>
  );
};

export default Tooltip;
