# Pixel Battle - HTML5 Canvas Pixel Editor

A modern pixel art editor built with Next.js, React, and TypeScript. Features HTML5 Canvas rendering for smooth performance, advanced zoom & pan controls, and a beautiful dark theme interface with professional-grade tools.

## 🚀 Core Features

### 1. **HTML5 Canvas Rendering**

- Direct Canvas API rendering for instant pixel updates
- Shadow effects for realistic drawing surface
- Smooth performance without DOM limitations
- Clean pixel borders without grid lines

### 2. **Advanced Drawing System**

- Bresenham line algorithm for smooth brush strokes
- No pixel skipping during fast mouse movements
- Instant visual feedback on pixel placement
- Continuous line drawing between mouse positions

### 3. **Professional Zoom & Pan Controls**

- Alt + Mouse Wheel for precise zoom control
- Right-click + Drag for canvas panning
- Zoom range from 10% to 500%
- Canvas centering on page load

### 4. **Modern Color Picker**

- HSV color space with visual color area
- Hue slider with precise color selection
- Hex color input with live validation
- 14 preset colors in organized grid
- Automatic slider sync with preset selection

### 5. **Clean Dark Interface**

- Professional dark theme (#100D20 background)
- Compact horizontal tools panel
- Floating color picker overlay
- Orange accent colors for visual hierarchy

### 6. **Optimized Performance**

- Efficient Map-based pixel storage
- React state management with update counters
- Shadow rendering with performance optimization
- Clean codebase without unnecessary comments

## 🎨 User Interface Features

- **Pixel Drawing**: Left-click to draw pixels with selected color
- **Smooth Brushing**: Fast mouse movements create continuous lines
- **Canvas Navigation**: Right-click + drag to pan around large canvases
- **Zoom Controls**: Alt + Mouse Wheel for detailed pixel work
- **Color Selection**: Professional HSV color picker with presets
- **Credits System**: Credit counter with add functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Navigation**: Header with leaderboard and FAQ pages
- **Modern Aesthetics**: Dark theme with orange accent colors

## 🎮 Controls

### Drawing Controls

- **Left Click**: Draw pixels with selected color
- **Mouse Drag**: Create continuous brush strokes
- **Color Picker**: Click color circle to open picker
- **Preset Colors**: Quick color selection from 14 presets

### Navigation Controls

- **Alt + Mouse Wheel**: Zoom in/out (10% - 500%)
- **Right Click + Drag**: Pan around the canvas
- **Auto Center**: Canvas centers automatically on load

### Color Picker Interface

- **HSV Area**: Click to select saturation and lightness
- **Hue Slider**: Drag to select color hue
- **Hex Input**: Enter precise hex color codes
- **Preset Grid**: 14 professional colors in 2x7 grid
- **Automatic Sync**: Sliders update when presets are selected

## 🚀 Performance Features

1. **Instant Rendering**: Direct Canvas API ensures immediate pixel updates
2. **Smooth Brushing**: Bresenham algorithm prevents pixel skipping
3. **Efficient Storage**: Map-based pixel data for optimal memory usage
4. **Shadow Optimization**: Performance-optimized shadow rendering
5. **Browser Compatibility**: Works in all modern browsers with Canvas support

## 🎯 Canvas Features

### Drawing Area

- **Fixed Grid Size**: 100x100 pixel canvas
- **Shadow Effects**: Realistic depth with drop shadows
- **Clean Borders**: Subtle border for canvas definition
- **Dark Background**: Professional #100D20 theme

### Color System

- **Default Color**: Red (#ff0000) for immediate drawing
- **HSV Color Space**: Professional color selection
- **Preset Palette**: 14 carefully chosen colors
- **Hex Support**: Direct hex code input (#ffffff format)

### Drawing Mechanics

- **Pixel Size**: 4x zoom factor for clear visibility
- **Brush Smoothing**: Continuous line drawing
- **Instant Feedback**: Immediate visual response
- **No Grid Lines**: Clean pixel art appearance

## 🛠️ Technical Stack

- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS for responsive design
- **Canvas**: HTML5 Canvas API for direct pixel rendering
- **State Management**: React hooks with Map-based pixel storage
- **Performance**: Bresenham algorithm for line drawing
- **Theme**: Custom dark theme with orange accents (#100D20)

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── leaderboard/     # Leaderboard page
│   ├── faq/            # FAQ page
│   └── page.tsx        # Main page
├── components/          # React components
│   ├── Header.tsx      # Navigation header with dark theme
│   ├── SimpleCanvas.tsx # HTML5 Canvas with Bresenham line drawing
│   ├── CanvasArea.tsx  # Canvas wrapper with coordinates display
│   ├── ToolsPanel.tsx  # Compact tools panel with credits
│   ├── ColorPicker.tsx # HSV color picker with presets
│   ├── CenterText.tsx  # Center text overlay
│   └── CoordinatesDisplay.tsx # Mouse position display
├── hooks/              # Custom React hooks
│   └── useSimpleCanvas.ts # Canvas state management
├── constants/          # Configuration constants
└── types/              # TypeScript type definitions
public/
├── logo.png           # ABATTLE logo
└── icons/             # SVG icons
```

## 🎯 Implementation Details

### Canvas Rendering with Shadows

```typescript
// Canvas rendering with shadow effects
const draw = useCallback(() => {
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#100D20";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Drawing area with shadow
  ctx.shadowColor = "#000000";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 8;

  ctx.fillStyle = "#1A1528";
  ctx.fillRect(position.x, position.y, gridSize, gridSize);

  // Pixels
  pixels.forEach((color, key) => {
    const [x, y] = key.split("-").map(Number);
    ctx.fillStyle = color;
    ctx.fillRect(
      position.x + x * pixelSize,
      position.y + y * pixelSize,
      pixelSize,
      pixelSize
    );
  });
}, [pixels, position, zoom]);
```

### Smooth Line Drawing

```typescript
// Bresenham algorithm for continuous lines
const drawLine = useCallback(
  (x0, y0, x1, y1) => {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let x = x0,
      y = y0;
    while (true) {
      onPixelClick(x, y);
      if (x === x1 && y === y1) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
  },
  [onPixelClick]
);
```

### HSV Color Picker

```typescript
// HSV to Hex conversion
const hslToHex = useCallback((h, s, l) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}, []);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with different grid sizes and zoom levels
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Drawing Issues

- Ensure left mouse button is working properly
- Try clicking slowly if fast movements skip pixels
- Check that Canvas API is supported in your browser
- Clear browser cache if drawing appears laggy

### Color Picker Issues

- Verify hex codes are in #ffffff format
- Check that HSV area responds to clicks
- Ensure preset colors are clickable
- Try refreshing if color sync is broken

### Navigation Issues

- Hold Alt key while scrolling to zoom
- Use right mouse button to drag canvas
- Check that mouse wheel events are enabled
- Try refreshing if pan/zoom becomes unresponsive

---

Built with ❤️ using Next.js and React
