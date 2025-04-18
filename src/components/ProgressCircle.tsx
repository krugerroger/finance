"use client";

import { useEffect, useRef, useState } from "react";

const ProgressCircle = ({ percentage = 75 }) => {
  const [progress, setProgress] = useState(0);
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  // Animation du pourcentage
  useEffect(() => {
    const duration = 8000; // 2 secondes
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setProgress(progress * percentage);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [percentage]);

  // Calcul de l'offset et de la couleur
  const offset = circumference - (progress / 100) * circumference;
  const color = `rgb(${255 * (1 - progress/percentage)}, ${255 * (progress/percentage)}, 0)`;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Cercle de fond (gris) */}
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        
        {/* Cercle de progression (couleur dynamique) */}
        <circle
          ref={circleRef}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={circumference} // Commence à 0%
          stroke={color}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          style={{
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 0.5s ease-out, stroke 0.5s ease-out",
          }}
        />
        
        {/* Texte au centre */}
        <text
          x="50"
          y="50"
          className="text-lg font-medium"
          textAnchor="middle"
          dy=".3em"
          fill="currentColor"
        >
          {Math.round(progress)}%
        </text>
      </svg>
    </div>
  );
};

export default ProgressCircle;