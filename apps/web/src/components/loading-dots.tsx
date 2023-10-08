import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const LoadingDots = ({
  className,
  dotsClassName,
  dotAmount = 3,
}: {
  className?: HTMLDivElement["className"];
  dotsClassName?: HTMLDivElement["className"];
  dotAmount?: number;
}) => (
  <motion.div
    initial={{
      opacity: 0,
    }}
    animate={{
      opacity: 1,
    }}
    transition={{
      duration: 0.2,
    }}
    className={cn("flex items-center space-x-1 flex-nowrap", className)}
  >
    {Array(dotAmount)
      .fill(0)
      .map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: i * 0.1,
            ease: "easeInOut",
          }}
          className={cn(
            "h-1 aspect-square bg-current rounded-full",
            dotsClassName
          )}
        />
      ))}
  </motion.div>
);
