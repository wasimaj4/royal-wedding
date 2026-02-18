"use client";

interface GoldOrnamentProps {
  type: "top" | "bottom" | "divider";
}

export default function GoldOrnament({ type }: GoldOrnamentProps) {
  if (type === "top") {
    return (
      <svg width="180" height="60" viewBox="0 0 180 60" className="text-gold">
        {/* Central crown-like ornament */}
        <path
          d="M90 5 L95 20 L105 15 L100 30 L110 25 L105 35 L90 30 L75 35 L70 25 L80 30 L75 15 L85 20 Z"
          fill="currentColor"
          opacity="0.7"
        />
        {/* Left flourish */}
        <path
          d="M70 35 Q50 30, 30 38 Q20 42, 10 38"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M65 40 Q45 35, 25 42 Q15 46, 5 42"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.3"
        />
        {/* Right flourish */}
        <path
          d="M110 35 Q130 30, 150 38 Q160 42, 170 38"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M115 40 Q135 35, 155 42 Q165 46, 175 42"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.3"
        />
        {/* Small diamonds */}
        <rect x="88" y="38" width="4" height="4" fill="currentColor" opacity="0.5" transform="rotate(45 90 40)" />
      </svg>
    );
  }

  if (type === "bottom") {
    return (
      <svg width="180" height="60" viewBox="0 0 180 60" className="text-gold">
        {/* Mirror of top ornament */}
        <path
          d="M90 55 L95 40 L105 45 L100 30 L110 35 L105 25 L90 30 L75 25 L70 35 L80 30 L75 45 L85 40 Z"
          fill="currentColor"
          opacity="0.7"
        />
        <path
          d="M70 25 Q50 30, 30 22 Q20 18, 10 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M110 25 Q130 30, 150 22 Q160 18, 170 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <rect x="88" y="16" width="4" height="4" fill="currentColor" opacity="0.5" transform="rotate(45 90 18)" />
      </svg>
    );
  }

  // Divider
  return (
    <svg width="300" height="30" viewBox="0 0 300 30" className="text-gold mx-auto block">
      {/* Left line */}
      <line x1="20" y1="15" x2="120" y2="15" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      {/* Central diamond */}
      <polygon points="145,10 150,15 155,10 150,5" fill="currentColor" opacity="0.6" />
      <polygon points="145,20 150,15 155,20 150,25" fill="currentColor" opacity="0.6" />
      {/* Small side diamonds */}
      <polygon points="130,13 133,15 130,17 127,15" fill="currentColor" opacity="0.4" />
      <polygon points="170,13 173,15 170,17 167,15" fill="currentColor" opacity="0.4" />
      {/* Right line */}
      <line x1="180" y1="15" x2="280" y2="15" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}
