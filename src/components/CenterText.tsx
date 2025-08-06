import { memo } from "react";

const CenterText: React.FC = memo(() => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-5">
      <div
        className="text-8xl font-bold text-white"
        style={{
          textShadow: "0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00ff00",
          filter: "drop-shadow(0 0 10px #00ff00)",
          fontFamily: "monospace",
          letterSpacing: "0.1em",
          transform: "scale(1.2)",
        }}
      >
        ABSTRACT
      </div>
    </div>
  );
});

export default CenterText;
