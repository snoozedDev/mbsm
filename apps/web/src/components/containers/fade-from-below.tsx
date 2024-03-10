"use client";
import { motion } from "framer-motion";
import { forwardRef } from "react";

export const FadeFromBelow = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & React.HTMLProps<HTMLDivElement>
>(function FadeFromBelow(
  { children, ...props }: { children: React.ReactNode },
  ref
) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="space-y-6 flex flex-col items-stretch w-full"
      {...props}
    >
      {children}
    </motion.div>
  );
});
