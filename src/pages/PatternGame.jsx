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

const motionTransition = { type: "spring", stiffness: 500, damping: 40 };

// ---------------------------------------------------------------------------
// 🔹 2. Custom Hook: Game Logic Engine
// ---------------------------------------------------------------------------

function useCopyPatternGame() {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = LEVELS[levelIndex];
  const targetPattern = currentLevel.pattern;

  // Helper function to generate a unique, shuffled pool for a given level
  const createPoolForLevel = useCallback((level) => {
    const iconCounts = {};
    const patternItems = level.pattern.map((icon) => {
        const count = iconCounts[icon] || 0;
        iconCounts[icon] = count + 1;
        // FIXED: Make item IDs unique across levels to prevent key collisions during transitions.
        return {
            id: `level-${level.id}-item-${icon}-${count}`,
            icon,
        };
    });
    return patternItems.sort(() => Math.random() - 0.5);
  }, []);


  const initialPool = useMemo(() => createPoolForLevel(currentLevel), [currentLevel, createPoolForLevel]);

  const [pool, setPool] = useState(initialPool);
  const [slots, setSlots] = useState(
    Array(targetPattern.length).fill(null)
  );

  const placeItemByDrag = useCallback(
    (item, slotIndex) => {
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

  const placeItemByClick = useCallback((itemToPlace) => {
    const firstEmptyIndex = slots.findIndex(slot => slot === null);
    if (firstEmptyIndex === -1) return;

    setSlots((prevSlots) => {
        const newSlots = [...prevSlots];
        newSlots[firstEmptyIndex] = itemToPlace;
        return newSlots;
    });
    setPool((prevPool) => prevPool.filter((p) => p.id !== itemToPlace.id));
  }, [slots]);

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
    
    // Use the reliable helper function to create the next pool
    const nextPool = createPoolForLevel(nextLevel);

    setSlots(Array(nextLevel.pattern.length).fill(null));
    setPool(nextPool);
  }, [levelIndex, createPoolForLevel]);

  return {
    pool,
    slots,
    placeItemByDrag,
    placeItemByClick,
    removeItem,
    isCompleted,
    goToNextLevel,
    level: currentLevel,
  };
}

// ---------------------------------------------------------------------------
// 🔹 3. UI Components (Mobile Responsive)
// ---------------------------------------------------------------------------

const Slot = React.memo(({ index, item, onRemove }) => {
  const slotClasses = clsx(
    "w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center transition-all duration-300",
    {
      "bg-sky-100/80 border-2 border-dashed border-sky-300": !item,
      "bg-white/90 shadow-inner": item,
    }
  );

  return (
    <div className={slotClasses}>
      {item ? (
        <DraggableItem
          item={item}
          onDragEnd={() => onRemove(index)}
          onClick={() => onRemove(index)}
          containerRef={null}
        />
      ) : (
        <div className="w-full h-full" />
      )}
    </div>
  );
});

const DraggableItem = ({ item, onDragEnd, containerRef, onClick }) => (
  <motion.div
    layoutId={`card-${item.id}`}
    drag
    dragConstraints={containerRef}
    dragElastic={0.4}
    onClick={() => onClick && onClick(item)}
    onDragEnd={(event, info) => onDragEnd(info, item)}
    className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl bg-white rounded-lg shadow-lg cursor-grab active:cursor-grabbing"
    whileHover={{ scale: 1.1, y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    whileTap={{ scale: 0.9 }}
    transition={motionTransition}
  >
    {item.icon}
  </motion.div>
);

// ---------------------------------------------------------------------------
// 🔹 4. Main Game Component (Mobile Responsive)
// ---------------------------------------------------------------------------

export default function CopyPatternGame() {
  const { pool, slots, placeItemByDrag, placeItemByClick, removeItem, isCompleted, goToNextLevel, level } =
    useCopyPatternGame();

  const poolRef = useRef(null);
  const slotRefs = useRef([]);

  const handleDragEnd = (info, item) => {
    const { point } = info;
    slotRefs.current.forEach((slotEl, index) => {
      if (slotEl) {
        const { top, left, right, bottom } = slotEl.getBoundingClientRect();
        if (point.x > left && point.x < right && point.y > top && point.y < bottom) {
          placeItemByDrag(item, index);
        }
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center gap-6 bg-gradient-to-b from-slate-50 to-slate-200 min-h-screen font-sans w-full">
      <header className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Pattern Master</h1>
        <p className="text-base sm:text-lg text-gray-600 mt-2">
          Level {level.id}: Recreate the sequence below.
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-3xl sm:text-4xl p-3 sm:p-4 bg-white/80 rounded-xl shadow-md backdrop-blur-sm">
        {level.pattern.map((icon, i) => <span key={`target-${i}`}>{icon}</span>)}
      </div>

      <LayoutGroup>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-2">
          {slots.map((item, i) => (
            <div key={`slot-wrapper-${i}`} ref={(el) => (slotRefs.current[i] = el)}>
              <Slot index={i} item={item} onRemove={removeItem} />
            </div>
          ))}
        </div>

        <div className="h-16 flex items-center">
          <AnimatePresence>
            {isCompleted && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={goToNextLevel}
                className="px-6 py-3 text-lg sm:text-xl font-semibold text-white bg-green-500 rounded-lg shadow-lg hover:bg-green-600 transition-transform hover:scale-105 active:scale-95"
              >
                ✅ Well Done! Next Level
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div
          ref={poolRef}
          className="flex flex-wrap justify-center items-start gap-3 sm:gap-4 mt-4 p-4 min-h-[120px] w-full max-w-3xl bg-gray-900/10 rounded-xl"
        >
          <AnimatePresence>
            {pool.map((item) => (
              <DraggableItem
                key={item.id}
                item={item}
                onDragEnd={handleDragEnd}
                onClick={placeItemByClick}
                containerRef={poolRef}
              />
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  );
}
