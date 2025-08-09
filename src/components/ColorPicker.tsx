import React, { useState, memo, useCallback, useMemo } from "react";

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = memo(
  ({ currentColor, onColorChange, isOpen = false, onClose }) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isActuallyOpen = isOpen || internalIsOpen;
    const [hue, setHue] = useState(0);
    const [saturation, setSaturation] = useState(0);
    const [lightness, setLightness] = useState(100);
    const [hexInput, setHexInput] = useState("#ffffff");

    const presetColors = useMemo(
      () => [
        "#ff0000",
        "#ff00ff",
        "#8000ff",
        "#4000ff",
        "#0080ff",
        "#00ffff",
        "#00ff80",
        "#00ff00",
        "#80ff00",
        "#ffff00",
        "#ffc000",
        "#ff8000",
        "#ffffff",
        "#000000",
      ],
      []
    );

    // Конвертация HSL в Hex
    const hslToHex = useCallback((h: number, s: number, l: number): string => {
      l /= 100;
      const a = (s * Math.min(l, 1 - l)) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
          .toString(16)
          .padStart(2, "0");
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    }, []);

    const handleHueChange = (newHue: number) => {
      setHue(newHue);
      const newColor = hslToHex(newHue, saturation, lightness);
      onColorChange(newColor);
      setHexInput(newColor);
    };

    // Конвертация Hex в HSL и обновление значений
    const updateFromHex = (hex: string) => {
      if (!hex.match(/^#[0-9A-Fa-f]{6}$/)) return;
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const l = (max + min) / 2;

      let h = 0;
      let s = 0;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      setHue(Math.round(h * 360));
      setSaturation(Math.round(s * 100));
      setLightness(Math.round(l * 100));
    };

    const handleHexChange = (hex: string) => {
      setHexInput(hex);
      if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
        onColorChange(hex);
        updateFromHex(hex);
      }
    };

    const handlePresetColorClick = (color: string) => {
      onColorChange(color);
      setHexInput(color);
      updateFromHex(color);
    };

    return (
      <div className="relative">
        {isActuallyOpen && (
          <div className="bg-gray-900 border border-orange-400 rounded-lg p-6 w-[400px] shadow-2xl relative">
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white text-sm transition-colors z-20"
              >
                ×
              </button>
            )}

            <div className="flex gap-6">
              <div className="flex-1">
                <div
                  className="w-full h-32 rounded-lg border border-gray-600 mb-4 relative cursor-crosshair"
                  style={{
                    background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`,
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const newSat = Math.round((x / rect.width) * 100);
                    const newLight = Math.round((1 - y / rect.height) * 100);
                    setSaturation(newSat);
                    setLightness(newLight);
                    const newColor = hslToHex(hue, newSat, newLight);
                    onColorChange(newColor);
                    setHexInput(newColor);
                  }}
                >
                  <div
                    className="absolute w-3 h-3 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${saturation}%`,
                      top: `${100 - lightness}%`,
                    }}
                  />
                </div>

                <div
                  className="relative h-4 rounded-lg mb-4 cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const newHue = Math.round((x / rect.width) * 360);
                    handleHueChange(newHue);
                  }}
                >
                  <div
                    className="absolute w-4 h-4 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 top-1/2"
                    style={{
                      left: `${(hue / 360) * 100}%`,
                      backgroundColor: `hsl(${hue}, 100%, 50%)`,
                    }}
                  />
                </div>

                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  placeholder="#ffffff"
                />
              </div>

              <div className="w-20">
                <div className="grid grid-cols-2 gap-2">
                  {presetColors.map((color, index) => (
                    <button
                      key={index}
                      className="w-8 h-8 rounded-md border border-gray-600 hover:border-white transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => handlePresetColorClick(color)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  onClose ? onClose() : setInternalIsOpen(false);
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 px-4 rounded-lg text-sm transition-colors"
              >
                Done
              </button>
              <button
                onClick={() => {
                  onClose ? onClose() : setInternalIsOpen(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default ColorPicker;
