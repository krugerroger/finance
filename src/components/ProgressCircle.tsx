"use client";

import { useEffect, useRef, useState } from "react";

const ProgressCircle = ({ percentage = 75 }: { percentage: number }) => {
  const [progress, setProgress] = useState(0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const duration = 2000; // Durée de l'animation (en ms)
    const start = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progressRatio = Math.min(elapsed / duration, 1);
      setProgress(progressRatio * percentage);

      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage]);

  const offset = circumference - (progress / 100) * circumference;
  const color = `rgb(${255 * (1 - progress / percentage)}, ${255 * (progress / percentage)}, 0)`;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Cercle de fond */}
        <circle
          strokeWidth="10"
          stroke="#e5e7eb"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />

        {/* Cercle de progression */}
        <circle
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke={color}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          style={{
            transition: "stroke-dashoffset 0.1s linear, stroke 0.1s linear",
          }}
        />

        {/* Pourcentage au centre */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dy=".3em"
          className="text-lg font-medium"
          fill="currentColor"
        >
          {Math.round(progress)}%
        </text>
      </svg>
    </div>
  );
};

export default ProgressCircle;
