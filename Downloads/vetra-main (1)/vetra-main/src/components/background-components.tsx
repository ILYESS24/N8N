import { cn } from "@/lib/index";
import { useState } from "react";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen w-full relative bg-white">
      {/* Gradient Background - Blue to Beige */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E8F4F8 0%, #F5F0E8 50%, #FFF8E7 100%)
          `,
          opacity: 0.8,
        }}
      />
      {/* Additional soft glow effects */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(232, 244, 248, 0.6) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(255, 248, 231, 0.6) 0%, transparent 50%)
          `,
        }}
      />
      {/* Your Content/Components */}
    </div>
  );
};
