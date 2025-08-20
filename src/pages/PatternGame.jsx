import React from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// 🔹 Custom Hook: Encapsulates all game logic
function useCopyPatternGame({ targetPattern, availableIcons }) {
  const [pool, setPool] = React.useState(
    availableIcons.map((icon, i) => ({ id: i, icon }))
  );
  const [slots, setSlots] = React.useState(
    Array(targetPattern.length).fill(null)
  );

  // Place an item into the next correct empty slot
  const placeItem = (item) => {
    const emptyIndex = targetPattern.findIndex(
      (icon, i) => icon === item.icon && slots[i] === null
    );
    if (emptyIndex === -1) return;

    setSlots((prev) => {
      const copy = [...prev];
      copy[emptyIndex] = item; // keep same ID for animation
      return copy;
    });

    // Remove from pool
    setPool((prev) => prev.filter((p) => p.id !== item.id));
  };

  // Remove item from slot → back to pool
  const removeItem = (index) => {
    const item = slots[index];
    if (!item) return;

    setSlots((prev) => {
      const copy = [...prev];
      copy[index] = null;
      return copy;
    });

    setPool((prev) => [...prev, item]);
  };

  // Check completion
  const isCompleted = slots.every((s, i) => s?.icon === targetPattern[i]);

  return {
    pool,
    slots,
    placeItem,
    removeItem,
    targetPattern,
    isCompleted,
  };
}

// 🔹 UI Components
const Slot = ({ item, onClick }) => (
  <div
    className={`w-16 h-16 rounded-md flex items-center justify-center transition-colors
      ${item ? "bg-white shadow-md" : "bg-sky-100 border-2 border-sky-200"}`}
  >
    {item && (
      <motion.div
        layoutId={`card-${item.id}`} // shared ID for animation
        onClick={onClick}
        className="w-14 h-14 flex items-center justify-center text-2xl bg-white rounded-md shadow cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {item.icon}
      </motion.div>
    )}
  </div>
);

const PoolItem = ({ item, onClick }) => (
  <motion.div
    key={item.id}
    layoutId={`card-${item.id}`} // same ID as in Slot
    onClick={onClick}
    className="w-16 h-16 flex items-center justify-center text-2xl 
              bg-white rounded-md shadow-lg cursor-pointer"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
  >
    {item.icon}
  </motion.div>
);

const PatternRow = ({ targetPattern }) => (
  <div className="flex gap-6 text-3xl">
    {targetPattern.map((icon, i) => (
      <span key={i}>{icon}</span>
    ))}
  </div>
);

// 🔹 Main Game Component
export default function CopyPatternGame() {
  const { pool, slots, placeItem, removeItem, targetPattern, isCompleted } =
    useCopyPatternGame({
      targetPattern: ["💜", "♠️", "💜", "♠️", "💜", "♠️", "💜", "♠️"],
      availableIcons: ["💜", "♠️"],
    });

  return (
    <div className="p-8 flex flex-col items-center gap-8 bg-white min-h-screen">
      {/* Instruction */}
      <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
        <span>{isCompleted ? "✅ Well Done!" : "Copy the pattern."}</span>
      </div>

      {/* Target Pattern Row */}
      <PatternRow targetPattern={targetPattern} />

      <LayoutGroup>
        {/* Slots Row */}
        <div className="flex gap-4">
          {slots.map((slot, i) => (
            <Slot key={i} item={slot} onClick={() => removeItem(i)} />
          ))}
        </div>

        {/* Pool Row */}
        <div className="flex gap-4 mt-6">
          <AnimatePresence>
            {pool.map((item) => (
              <PoolItem
                key={item.id}
                item={item}
                onClick={() => placeItem(item)}
              />
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  );
}
