import React, { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { clsx } from "clsx";

// ---------------------------------------------------------------------------
// 🔹 1. Configuration
// ---------------------------------------------------------------------------

const LEVELS = [
  { id: 1, pattern: ["♦️", "⭐", "♦️", "⭐"] },
  { id: 2, pattern: ["🌙", "🌙", "☀️", "☀️", "🌙"] },
  { id: 3, pattern: ["♠️", "💜", "♠️", "💜", "♠️", "💜"] },
  { id: 4, pattern: ["🚀", "🪐", "✨", "🚀", "🪐", "✨", "🚀"] },
];

const motionTransition = { type: "spring", stiffness: 400, damping: 30 };

// ---------------------------------------------------------------------------
// 🔹 2. Custom Hook: Game Logic Engine (Refactored for Levels)
// ---------------------------------------------------------------------------

function useCopyPatternGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = LEVELS[levelIndex];
  const targetPattern = currentLevel.pattern;

  const initialPool = useMemo(() => {
    // Shuffle the pool for a better challenge
    const patternItems = targetPattern.map((icon, index) => ({
      id: `item-${icon}-${index}`,
      icon,
    }));
    return patternItems.sort(() => Math.random() - 0.5);
  }, [targetPattern]);

  const [pool, setPool] = useState(initialPool);
  const [slots, setSlots] = useState(
    Array(targetPattern.length).fill(null)
  );

  const placeItem = useCallback(
    (item, slotIndex) => {
      // Prevent placing if the slot is already occupied
      if (slots[slotIndex] !== null) return;

      setSlots((prev) => {
        const newSlots = [...prev];
        newSlots[slotIndex] = item;
        return newSlots;
      });
      setPool((prev) => prev.filter((p) => p.id !== item.id));
    },
    [slots]
  );

  const removeItem = useCallback(
    (slotIndex) => {
      const item = slots[slotIndex];
      if (!item) return;

      setSlots((prev) => {
        const newSlots = [...prev];
        newSlots[slotIndex] = null;
        return newSlots;
      });
      setPool((prev) => [...prev, item]);
    },
    [slots]
  );

  const isCompleted = useMemo(
    () => slots.every((slot, i) => slot?.icon === targetPattern[i]),
    [slots, targetPattern]
  );

  const goToNextLevel = useCallback(() => {
    const nextLevelIndex = (levelIndex + 1) % LEVELS.length;
    setLevelIndex(nextLevelIndex);
    const nextLevel = LEVELS[nextLevelIndex];
    const nextPool = nextLevel.pattern
      .map((icon, index) => ({ id: `item-${icon}-${index}`, icon }))
      .sort(() => Math.random() - 0.5);

    setSlots(Array(nextLevel.pattern.length).fill(null));
    setPool(nextPool);
  }, [levelIndex]);

  return {
    pool,
    slots,
    placeItem,
    removeItem,
    isCompleted,
    goToNextLevel,
    level: currentLevel,
  };
}

// ---------------------------------------------------------------------------
// 🔹 3. UI Components (Adapted for Drag-and-Drop)
// ---------------------------------------------------------------------------

const Slot = React.memo(({ index, item, onDrop, onRemove }) => {
  const slotRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const slotClasses = clsx(
    "w-20 h-20 rounded-lg flex items-center justify-center transition-all duration-300",
    {
      "bg-sky-100 border-2 border-dashed border-sky-300": !item,
      "bg-white shadow-inner": item,
      "bg-green-200 border-green-400 scale-105": isHovered && !item,
    }
  );

  return (
    <div ref={slotRef} className={slotClasses}>
      {item ? (
        <DraggableItem
          item={item}
          onDragEnd={() => onRemove(index)}
          containerRef={null} // No constraints when dragging out of a slot
        />
      ) : (
        <div className="w-full h-full" />
      )}
    </div>
  );
});

const DraggableItem = ({ item, onDragEnd, containerRef }) => (
  <motion.div
    layoutId={`card-${item.id}`}
    drag
    dragConstraints={containerRef}
    dragElastic={0.4}
    onDragEnd={(event, info) => onDragEnd(info, item)}
    className="w-16 h-16 flex items-center justify-center text-3xl bg-white rounded-lg shadow-lg cursor-grab active:cursor-grabbing"
    whileHover={{ scale: 1.1, y: -5 }}
    whileTap={{ scale: 0.9 }}
    transition={motionTransition}
  >
    {item.icon}
  </motion.div>
);

// ---------------------------------------------------------------------------
// 🔹 4. Main Game Component
// ---------------------------------------------------------------------------

export default function CopyPatternGame() {
  const { pool, slots, placeItem, removeItem, isCompleted, goToNextLevel, level } =
    useCopyPatternGame();

  const poolRef = useRef(null);
  const slotRefs = useRef([]);

  const handleDragEnd = (info, item) => {
    const { point } = info;
    let droppedInSlot = false;

    slotRefs.current.forEach((slotEl, index) => {
      if (slotEl) {
        const { top, left, right, bottom } = slotEl.getBoundingClientRect();
        if (point.x > left && point.x < right && point.y > top && point.y < bottom) {
          placeItem(item, index);
          droppedInSlot = true;
        }
      }
    });
  };

  return (
    <div className="p-4 sm:p-8 flex flex-col items-center gap-8 bg-slate-100 min-h-screen font-sans">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Pattern Master</h1>
        <p className="text-lg text-gray-600 mt-2">
          Level {level.id}: Recreate the sequence below.
        </p>
      </header>

      {/* Target Pattern */}
      <div className="flex gap-4 sm:gap-6 text-4xl p-4 bg-white rounded-xl shadow-md">
        {level.pattern.map((icon, i) => <span key={`target-${i}`}>{icon}</span>)}
      </div>

      <LayoutGroup>
        {/* User Slots (Drop Zone) */}
        <div className="flex flex-wrap justify-center gap-4">
          {slots.map((item, i) => (
            <div key={`slot-wrapper-${i}`} ref={(el) => (slotRefs.current[i] = el)}>
              <Slot
                index={i}
                item={item}
                onDrop={placeItem}
                onRemove={removeItem}
              />
            </div>
          ))}
        </div>

        {/* Completion Message & Button */}
        <div className="h-16 flex items-center">
          <AnimatePresence>
            {isCompleted && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={goToNextLevel}
                className="px-8 py-3 text-xl font-semibold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-transform hover:scale-105"
              >
                ✅ Well Done! Next Level
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Item Pool (Drag Source) */}
        <div
          ref={poolRef}
          className="flex flex-wrap justify-center gap-4 mt-4 p-4 min-h-[120px] w-full max-w-2xl bg-gray-200 rounded-xl"
        >
          <AnimatePresence>
            {pool.map((item) => (
              <DraggableItem
                key={item.id}
                item={item}
                onDragEnd={handleDragEnd}
                containerRef={poolRef}
              />
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  );
}
