"use client";

import { motion } from "framer-motion";

const puzzleColors = ["#1E88E5", "#FDD835", "#EF476F", "#06D6A0", "#118AB2"];

function PuzzlePiece({
  color,
  size,
  x,
  y,
  delay,
  duration,
}: {
  color: string;
  size: number;
  x: string;
  y: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="absolute opacity-20 dark:opacity-10"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <path
        d="M50 0 C50 0, 65 0, 65 0 C65 0, 65 10, 75 10 C85 10, 85 0, 85 0 L100 0 L100 35 C100 35, 90 35, 90 45 C90 55, 100 55, 100 55 L100 100 L65 100 C65 100, 65 90, 55 90 C45 90, 45 100, 45 100 L0 100 L0 65 C0 65, 10 65, 10 55 C10 45, 0 45, 0 45 L0 0 Z"
        fill={color}
      />
    </motion.svg>
  );
}

export function PuzzlePieces() {
  const pieces = [
    { color: puzzleColors[0], size: 60, x: "5%", y: "10%", delay: 0, duration: 6 },
    { color: puzzleColors[1], size: 45, x: "80%", y: "5%", delay: 1, duration: 7 },
    { color: puzzleColors[2], size: 50, x: "70%", y: "60%", delay: 0.5, duration: 5 },
    { color: puzzleColors[3], size: 40, x: "15%", y: "70%", delay: 1.5, duration: 8 },
    { color: puzzleColors[4], size: 55, x: "50%", y: "30%", delay: 2, duration: 6 },
    { color: puzzleColors[0], size: 35, x: "90%", y: "80%", delay: 0.8, duration: 7 },
    { color: puzzleColors[1], size: 42, x: "35%", y: "85%", delay: 1.2, duration: 5.5 },
    { color: puzzleColors[2], size: 38, x: "60%", y: "15%", delay: 2.5, duration: 6.5 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece, i) => (
        <PuzzlePiece key={i} {...piece} />
      ))}
    </div>
  );
}
