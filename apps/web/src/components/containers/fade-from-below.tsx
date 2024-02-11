"use client";
import { motion } from "framer-motion";

export const FadeFromBelow = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="space-y-6 flex flex-col items-stretch w-full"
    >
      {children}
    </motion.div>
  );
};
