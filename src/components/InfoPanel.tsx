interface InfoPanelProps {
  gridSize: number;
  pixelSize: number;
  currentColor: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  gridSize,
  pixelSize,
  currentColor,
}) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h3 className="text-cyan-400 font-bold mb-3 text-sm">CREDITS</h3>
      <div className="text-center">
        <div className="text-6xl font-bold text-yellow-400 mb-2">0</div>
        <div className="text-xs text-gray-400">
          Grid: {gridSize}×{gridSize} | Size: {pixelSize}px
        </div>
      </div>
    </div>
  );
};
export default InfoPanel;
