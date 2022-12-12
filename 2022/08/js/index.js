const fs = require("fs");

const trees = fs
  .readFileSync("../input.txt", "utf8")
  .trim()
  .split("\n")
  .map((line) => line.split("").map(Number));
let visible = new Set();
let tallestSoFar;
for (let col = 0; col < trees[0].length; col++) {
  tallestSoFar = -Infinity;
  // top to bottom
  for (let row = 0; row < trees.length; row++) {
    const current = trees[row][col];
    if (current > tallestSoFar) {
      visible.add(`${col},${row}`);
      tallestSoFar = current;
      if (current === 9) {
        break;
      }
    }
  }
  tallestSoFar = -Infinity;
  // bottom to top
  for (let row = trees.length - 1; row >= 0; row--) {
    const current = trees[row][col];
    if (current > tallestSoFar) {
      visible.add(`${col},${row}`);
      tallestSoFar = current;
      if (current === 9) {
        break;
      }
    }
  }
}
for (let row = 0; row < trees.length; row++) {
  tallestSoFar = -Infinity;
  for (let col = 0; col < trees[0].length; col++) {
    const current = trees[row][col];
    if (current > tallestSoFar) {
      visible.add(`${col},${row}`);
      tallestSoFar = current;
      if (current === 9) {
        break;
      }
    }
  }
  tallestSoFar = -Infinity;
  for (let col = trees[0].length - 1; col >= 0; col--) {
    const current = trees[row][col];
    if (current > tallestSoFar) {
      visible.add(`${col},${row}`);
      tallestSoFar = current;
      if (current === 9) {
        break;
      }
    }
  }
}
console.log("Part 1:", visible.size);

const scenicScore = (row, col) => {
  const current = trees[row][col];
  let scoreUp = 0;
  let scoreDown = 0;
  let scoreLeft = 0;
  let scoreRight = 0;
  for (let r = row + 1; r < trees.length; r++) {
    scoreDown++;
    if (r >= trees.length || trees[r][col] >= current) {
      break;
    }
  }
  for (let r = row - 1; r >= 0; r--) {
    scoreUp++;
    if (r < 0 || trees[r][col] >= current) {
      break;
    }
  }
  for (let c = col + 1; c < trees[0].length; c++) {
    scoreRight++;
    if (c >= trees[0].length || trees[row][c] >= current) {
      break;
    }
  }
  for (let c = col - 1; c >= 0; c--) {
    scoreLeft++;
    if (c < 0 || trees[row][c] >= current) {
      break;
    }
  }
  return scoreUp * scoreDown * scoreLeft * scoreRight;
};
const scores = JSON.parse(JSON.stringify(trees)); // too lazy to initialize an empty copy of the right size
for (let row = 0; row < trees.length; row++) {
  for (let col = 0; col < trees[0].length; col++) {
    scores[row][col] = scenicScore(row, col);
  }
}
console.log("Part 2:", Math.max(...scores.map((row) => Math.max(...row))));
