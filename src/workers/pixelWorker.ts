// Optimized Web Worker for handling large pixel grids
let pixelData: { [key: string]: string } = {};
let batchQueue: { [key: string]: string } = {};
let batchTimeout: ReturnType<typeof setTimeout> | null = null;

const BATCH_DELAY = 0; // Instant updates - no delay for Paint-like performance

const flushBatch = () => {
  if (Object.keys(batchQueue).length > 0) {
    pixelData = { ...pixelData, ...batchQueue };
    batchQueue = {};
  }
  batchTimeout = null;
};

self.onmessage = (event) => {
  const { type, data } = event.data;

  switch (type) {
    case "BATCH_UPDATE":
      // Instant update for Paint-like performance
      pixelData = { ...pixelData, ...data };

      // Send back the updated data immediately
      self.postMessage({
        type: "BATCH_UPDATE",
        data: pixelData,
      });
      break;

    case "FLUSH_BATCH":
      flushBatch();
      // Send back the updated data
      self.postMessage({
        type: "BATCH_UPDATE",
        data: pixelData,
      });
      break;

    case "CLEAR_ALL":
      pixelData = {};
      batchQueue = {};
      if (batchTimeout) {
        clearTimeout(batchTimeout);
        batchTimeout = null;
      }
      self.postMessage({
        type: "CLEAR_ALL",
        data: {},
      });
      break;

    case "GET_STATE":
      self.postMessage({
        type: "GET_STATE",
        data: pixelData,
      });
      break;

    default:
      console.warn("Unknown message type:", type);
  }
};

// TypeScript worker context
export {};
