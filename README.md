# ABATTLE - Optimized Pixel Editor

A high-performance pixel editor built with Next.js, React, and TypeScript. Optimized for handling large grid sizes without browser performance issues. Features advanced zoom controls for detailed pixel work and a modern battle-themed interface.

## 🚀 Performance Optimizations

### 1. **Virtual Rendering**

- Only renders visible pixels in the viewport
- Uses viewport calculation with buffer zones
- Dramatically reduces DOM elements for large grids

### 2. **Batch Updates**

- Groups pixel updates into batches
- Updates state at 60fps for smooth performance
- Reduces React re-renders

### 3. **Web Workers**

- Uses Web Workers for grids larger than 256x256
- Offloads pixel processing to background threads
- Prevents main thread blocking

### 4. **Dynamic Pixel Sizing**

- Auto-adjusts pixel size based on grid size
- Manual pixel size control for fine-tuning
- Performance recommendations

### 5. **Memory Management**

- Efficient pixel data storage
- Automatic cleanup of off-screen elements
- Optimized state management

### 6. **Advanced Zoom System**

- Smooth zoom from 10% to 500%
- Mouse wheel zoom with center point preservation
- Zoom to fit functionality
- Precise zoom controls with slider

## 🎨 Features

- **Dynamic Grid Sizing**: Choose from 32×32 to 1024×1024 grids
- **Virtual Rendering**: Smooth performance with large grids
- **Real-time Drawing**: Draw with mouse or touch
- **Color Picker**: Full color palette support
- **Canvas Dragging**: Right-click and drag to move canvas
- **Advanced Zoom Controls**: Zoom from 10% to 500% with mouse wheel
- **Performance Monitoring**: Real-time performance metrics
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Battle-themed interface with gradient backgrounds
- **Navigation**: Leaderboard and FAQ pages

## 🔧 Configuration

### Grid Size Presets

- Small: 32×32 (1,024 pixels)
- Medium: 64×64 (4,096 pixels)
- Large: 128×128 (16,384 pixels)
- Extra Large: 256×256 (65,536 pixels)
- Huge: 512×512 (262,144 pixels)

### Pixel Size Options

- Tiny: 4px
- Small: 6px
- Medium: 10px
- Large: 16px
- Extra Large: 24px

### Zoom Controls

- **Mouse Wheel**: Scroll to zoom in/out
- **Zoom In/Out Buttons**: Precise zoom control
- **Reset Button**: Return to 100% zoom
- **Fit to Screen**: Automatically fit grid to viewport
- **Zoom Slider**: Direct zoom level selection (10% - 500%)

## 🚀 Performance Tips

1. **Use Recommended Pixel Sizes**: The app suggests optimal pixel sizes for each grid size
2. **Monitor Performance**: Watch the performance percentage in the info panel
3. **Clear Canvas**: Use the clear button to free memory when switching large grids
4. **Browser Compatibility**: Modern browsers with Web Worker support work best
5. **Zoom for Detail**: Use zoom controls for detailed pixel work on large grids

## 🎯 Zoom Features

### Mouse Wheel Zoom

- Scroll up to zoom in
- Scroll down to zoom out
- Zoom centers on mouse position
- Smooth zoom transitions

### Zoom Controls Panel

- **Zoom In (+)** : Increase zoom by 10%
- **Zoom Out (-)** : Decrease zoom by 10%
- **Reset** : Return to 100% zoom
- **Fit to Screen** : Automatically scale to fit viewport
- **Zoom Slider** : Direct zoom level control

### Zoom Ranges

- **Minimum**: 10% (for overview of large grids)
- **Default**: 100% (normal view)
- **Maximum**: 500% (for detailed pixel work)

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks with optimized state updates
- **Performance**: Web Workers, Virtual Rendering, Batch Updates
- **Zoom System**: Custom zoom implementation with viewport calculations
- **UI Design**: Modern gradient backgrounds with battle theme

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── leaderboard/     # Leaderboard page
│   ├── faq/            # FAQ page
│   └── page.tsx        # Main page
├── components/          # React components
│   ├── Header.tsx      # Navigation header with logo
│   ├── PixelGrid.tsx   # Optimized pixel grid with virtual rendering & zoom
│   ├── CanvasArea.tsx  # Canvas container
│   ├── ToolsPanel.tsx  # Tools and controls
│   ├── ZoomControls.tsx # Zoom control panel
│   └── InfoPanel.tsx   # Performance monitoring
├── hooks/              # Custom React hooks
│   └── usePixelStore.ts # Optimized state management with zoom
├── workers/            # Web Workers
│   └── pixelWorker.ts  # Background pixel processing
├── constants/          # Configuration constants
└── types/              # TypeScript type definitions
public/
├── logo.png           # ABATTLE logo
└── icons/             # SVG icons
```

## 🎯 Key Optimizations

### Virtual Rendering Implementation

```typescript
// Only render visible pixels
const visiblePixels = useMemo(() => {
  const pixelElements: ReactElement[] = [];

  for (let y = visibleRange.startY; y < visibleRange.endY; y++) {
    for (let x = visibleRange.startX; x < visibleRange.endX; x++) {
      // Create pixel element only if visible
    }
  }

  return pixelElements;
}, [visibleRange, pixels, gridSize]);
```

### Batch Updates

```typescript
// Group updates for better performance
const setPixel = useCallback(
  (x: number, y: number, color: string) => {
    batchUpdatesRef.current.set(key, color);

    // Flush updates at 60fps
    timeoutRef.current = setTimeout(() => {
      flushBatchUpdates();
    }, 16);
  },
  [gridSize, flushBatchUpdates]
);
```

### Zoom Implementation

```typescript
// Handle mouse wheel zoom with center point preservation
const handleWheel = useCallback(
  (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.1, Math.min(5.0, zoom + delta));

    // Calculate zoom center and adjust position
    const zoomCenterX = (mouseX - position.x) / zoom;
    const zoomCenterY = (mouseY - position.y) / zoom;

    onZoomChange(newZoom);
    onPositionChange({ x: newPositionX, y: newPositionY });
  },
  [zoom, position, onZoomChange, onPositionChange]
);
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

### Performance Issues

- Reduce grid size or pixel size
- Check browser console for Web Worker errors
- Ensure you're using a modern browser
- Clear browser cache if needed

### Large Grids Not Working

- Verify Web Worker support in your browser
- Check available memory
- Try smaller grid sizes first

### Zoom Issues

- Ensure mouse wheel is working properly
- Try using zoom control buttons instead
- Reset zoom to 100% if view becomes distorted
- Use "Fit to Screen" for optimal view

---

Built with ❤️ using Next.js and React
