/**
 * Number Pattern Definitions for Grid-Based Validation
 * 
 * Each digit 0-9 is represented as a 7x7 grid.
 * Values: 1 = ink expected, 0 = empty expected
 * 
 * The grid maps approximate how children naturally draw numbers,
 * with some tolerance built into the structural shapes.
 */

// 7x7 patterns for digits 0-9
const PATTERNS = {
  0: [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
  ],
  1: [
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
  ],
  2: [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
  ],
  3: [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
  ],
  4: [
    [0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0],
  ],
  5: [
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
  ],
  6: [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
  ],
  7: [
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0],
  ],
  8: [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
  ],
  9: [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
  ],
};

const GRID_SIZE = 7;

/**
 * Extract the bounding box of all drawn pixels, then
 * compute the ink density for each cell of a 7×7 grid
 * stretched over that bounding box.
 *
 * @param {ImageData} imageData - The canvas imageData
 * @param {number} canvasW - Canvas width
 * @param {number} canvasH - Canvas height
 * @returns {{ grid: number[][], totalInk: number }}
 */
export function extractGrid(imageData, canvasW, canvasH) {
  const data = imageData.data;

  // 1. Find bounding box of all drawn pixels
  let minX = canvasW, minY = canvasH, maxX = 0, maxY = 0;
  let totalInk = 0;

  for (let y = 0; y < canvasH; y++) {
    for (let x = 0; x < canvasW; x++) {
      const idx = (y * canvasW + x) * 4;
      if (data[idx + 3] > 50) { // alpha > 50
        totalInk++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Not enough ink drawn
  if (totalInk < 80) {
    return { grid: null, totalInk };
  }

  // 2. Add a small padding around the bounding box (5% of canvas)
  const pad = Math.floor(Math.max(canvasW, canvasH) * 0.03);
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(canvasW - 1, maxX + pad);
  maxY = Math.min(canvasH - 1, maxY + pad);

  const bboxW = maxX - minX + 1;
  const bboxH = maxY - minY + 1;

  // 3. Make the bounding box square (centered) for uniform comparison
  let squareSize = Math.max(bboxW, bboxH);
  let offsetX = minX - Math.floor((squareSize - bboxW) / 2);
  let offsetY = minY - Math.floor((squareSize - bboxH) / 2);

  // Clamp offsets
  offsetX = Math.max(0, Math.min(offsetX, canvasW - squareSize));
  offsetY = Math.max(0, Math.min(offsetY, canvasH - squareSize));
  squareSize = Math.min(squareSize, canvasW, canvasH);

  // 4. Divide the square bounding box into 7x7 cells and compute density
  const cellW = squareSize / GRID_SIZE;
  const cellH = squareSize / GRID_SIZE;
  const grid = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    const gridRow = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      const cellStartX = Math.floor(offsetX + col * cellW);
      const cellStartY = Math.floor(offsetY + row * cellH);
      const cellEndX = Math.floor(offsetX + (col + 1) * cellW);
      const cellEndY = Math.floor(offsetY + (row + 1) * cellH);

      let inkCount = 0;
      let pixelCount = 0;

      for (let y = cellStartY; y < cellEndY && y < canvasH; y++) {
        for (let x = cellStartX; x < cellEndX && x < canvasW; x++) {
          pixelCount++;
          const idx = (y * canvasW + x) * 4;
          if (data[idx + 3] > 50) {
            inkCount++;
          }
        }
      }

      // Density: 0 to 1
      gridRow.push(pixelCount > 0 ? inkCount / pixelCount : 0);
    }
    grid.push(gridRow);
  }

  return { grid, totalInk };
}

/**
 * Compare a user's density grid against a reference pattern.
 * 
 * Scoring:
 * - For cells where pattern = 1 (ink expected): reward higher density
 * - For cells where pattern = 0 (empty expected): penalize higher density
 * 
 * Returns a score from 0 to 1 (1 = perfect match).
 */
export function compareToPattern(userGrid, pattern) {
  if (!userGrid) return 0;

  // Convert user grid to binary using an adaptive threshold
  // Find the mean density to set a relative threshold
  let totalDensity = 0;
  let count = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      totalDensity += userGrid[r][c];
      count++;
    }
  }
  const meanDensity = totalDensity / count;
  const threshold = Math.max(0.04, meanDensity * 0.35);

  let matches = 0;
  let total = 0;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const hasInk = userGrid[r][c] > threshold ? 1 : 0;
      const expected = pattern[r][c];

      // Weight: cells on the expected pattern are more important
      if (expected === 1) {
        total += 1.2;
        if (hasInk === 1) matches += 1.2;
      } else {
        total += 1.0;
        if (hasInk === 0) matches += 1.0;
      }
    }
  }

  return total > 0 ? matches / total : 0;
}

/**
 * Validate a user's drawing against a target digit.
 * 
 * Strategy:
 * 1. Extract the 7x7 density grid from the user's drawing
 * 2. Score the drawing against ALL 10 digit patterns
 * 3. Accept only if:
 *    - The target digit has the highest (or near-highest) score
 *    - The score exceeds a minimum threshold
 *
 * @param {ImageData} imageData
 * @param {number} canvasW
 * @param {number} canvasH 
 * @param {number} targetDigit - 0-9
 * @returns {boolean}
 */
export function validateAgainstPattern(imageData, canvasW, canvasH, targetDigit) {
  const { grid, totalInk } = extractGrid(imageData, canvasW, canvasH);

  // Not enough drawing
  if (!grid || totalInk < 80) return false;

  // Score against all digits
  const scores = {};
  for (let d = 0; d <= 9; d++) {
    scores[d] = compareToPattern(grid, PATTERNS[d]);
  }

  const targetScore = scores[targetDigit];

  // Find the best matching digit
  let bestDigit = 0;
  let bestScore = -1;
  for (let d = 0; d <= 9; d++) {
    if (scores[d] > bestScore) {
      bestScore = scores[d];
      bestDigit = d;
    }
  }

  // Minimum quality threshold for the target
  const MIN_SCORE = 0.52;

  // Accept if:
  // 1. Target score is above minimum
  // 2. Target is the best match, OR very close to the best (within 0.08)
  const isTopMatch = bestDigit === targetDigit;
  const isCloseToTop = (bestScore - targetScore) < 0.08;

  return targetScore >= MIN_SCORE && (isTopMatch || isCloseToTop);
}

export { PATTERNS, GRID_SIZE };
