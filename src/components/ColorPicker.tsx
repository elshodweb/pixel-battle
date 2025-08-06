import React, { useState } from "react";
interface ColorPickerProps {
    currentColor: string;
    onColorChange: (color: string) => void;
  }
  
  const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onColorChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hue, setHue] = useState(0);
    const [saturation, setSaturation] = useState(100);
    const [lightness, setLightness] = useState(50);
    const [alpha, setAlpha] = useState(1);
    
    const presetColors = [
      '#ff0066', '#00ff66', '#6600ff', '#ffff00', '#ff6600', '#00ffff',
      '#ffffff', '#000000', '#666666', '#990000', '#009900', '#000099',
      '#999900', '#990099', '#009999', '#ff9900'
    ];
  
    // Convert HSL to HEX
    const hslToHex = (h: number, s: number, l: number) => {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };
  
    // Convert HEX to HSL
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
  
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
  
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
  
      return [h * 360, s * 100, l * 100];
    };
  
    // Update HSL when color changes externally (not from sliders)
    React.useEffect(() => {
      if (!isOpen) return; // Only update when picker is closed to avoid conflicts
      const [h, s, l] = hexToHsl(currentColor);
      setHue(h);
      setSaturation(s);
      setLightness(l);
    }, [currentColor, isOpen]);
  
    
    const handleHueChange = (newHue: number) => {
      setHue(newHue);
      const newColor = hslToHex(newHue, saturation, lightness);
      onColorChange(newColor);
    };
  
    const handleSaturationChange = (newSaturation: number) => {
      setSaturation(newSaturation);
      const newColor = hslToHex(hue, newSaturation, lightness);
      onColorChange(newColor);
    };
  
    const handleLightnessChange = (newLightness: number) => {
      setLightness(newLightness);
      const newColor = hslToHex(hue, saturation, newLightness);
      onColorChange(newColor);
    };
  
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 relative">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-12 h-12 rounded-full border-2 border-cyan-400 cursor-pointer relative overflow-hidden"
            onClick={() => setIsOpen(!isOpen)}
            style={{ backgroundColor: currentColor }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
          <div>
            <div className="text-cyan-400 text-sm font-bold">Color</div>
            <div className="text-cyan-400 text-sm font-bold">selection</div>
          </div>
        </div>
  
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg p-4 z-10 w-80">
            {/* Color Preview */}
            <div className="w-full h-12 rounded-lg border border-gray-600 mb-4" style={{ backgroundColor: currentColor }}></div>
            
            {/* Hue Slider */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-2">Hue: {Math.round(hue)}°</label>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={(e) => handleHueChange(Number(e.target.value))}
                  className="w-full h-6 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                  }}
                />
              </div>
            </div>
  
            {/* Saturation Slider */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-2">Saturation: {Math.round(saturation)}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => handleSaturationChange(Number(e.target.value))}
                className="w-full h-6 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`,
                }}
              />
            </div>
  
            {/* Lightness Slider */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-2">Lightness: {Math.round(lightness)}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={lightness}
                onChange={(e) => handleLightnessChange(Number(e.target.value))}
                className="w-full h-6 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`,
                }}
              />
            </div>
  
            {/* HTML Color Input */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-2">Hex Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="w-12 h-8 border border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={currentColor}
                  onChange={(e) => onColorChange(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm text-white"
                  placeholder="#000000"
                />
              </div>
            </div>
            
            {/* Preset Colors */}
            <div className="mb-4">
              <label className="block text-xs text-gray-400 mb-2">Preset Colors</label>
              <div className="grid grid-cols-8 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onColorChange(color)}
                    className={`w-8 h-8 rounded border-2 transition-all ${
                      currentColor === color 
                        ? 'border-cyan-400 shadow-lg shadow-cyan-400/50' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded text-sm transition-colors"
              >
                Done
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-2">{currentColor}</div>
      </div>
    );
  };
  
  
export default ColorPicker;
