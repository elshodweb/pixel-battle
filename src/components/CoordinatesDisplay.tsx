interface CoordinatesDisplayProps {
    mousePosition: { x: number; y: number } | null;
  }
  
  const CoordinatesDisplay: React.FC<CoordinatesDisplayProps> = ({ mousePosition }) => {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg px-6 py-3 text-center">
        <div className="text-cyan-400 font-bold text-3xl">
          {mousePosition ? `${mousePosition.x}, ${mousePosition.y}` : '-, -'}
        </div>
        <div className="text-xs text-gray-400 mt-1">COORDINATES</div>
      </div>
    );
  };
  export default CoordinatesDisplay;