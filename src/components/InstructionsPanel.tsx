const InstructionsPanel: React.FC = () => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <h3 className="text-cyan-400 font-bold mb-3 text-sm">HOW TO PLAY</h3>
      <div className="space-y-2 text-xs text-gray-300">
        <div>• Click pixels to paint</div>
        <div>• Hold & drag to draw</div>
        <div>• Pick colors from palette</div>
        <div>• View live coordinates</div>
        <div>• Clear to start over</div>
      </div>
    </div>
  );
};
export default InstructionsPanel;
