import React from "react";
import { motion } from "framer-motion";

function EmojiRenderComponent({ visuals = [], single = false }) {
  return (
    <div className="flex justify-left">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`inline-flex flex-wrap ${
          single ? "gap-2 sm:gap-4 p-2 sm:p-2" : "gap-3 sm:gap-5 p-3 sm:p-5"
        } rounded-lg bg-purple-50`}
      >
        {single ? (
          // Single emoji mode (render each separately with motion.span)
          <div className="flex flex-wrap gap-3 text-4xl">
            {visuals.map((emoji, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: i * 0.05,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        ) : (
          // Grouped mode (render each group as a block)
          visuals.map((group, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: i * 0.05,
                type: "spring",
                stiffness: 300,
              }}
              className="text-3xl sm:text-4xl"
            >
              {group}
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}

export default EmojiRenderComponent;
