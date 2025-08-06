import { memo } from "react";

interface ClearButtonProps {
  onClear: () => void;
}

const ClearButton: React.FC<ClearButtonProps> = memo(({ onClear }) => {
  return (
    <button
      onClick={onClear}
      className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg border border-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
    >
      CLEAR ALL
    </button>
  );
});

export default ClearButton;
