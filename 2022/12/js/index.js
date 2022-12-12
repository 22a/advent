const fs = require("fs");

const lines = fs.readFileSync("../input.txt", "utf8").trim().split("\n");

for (let part of [1, 2]) {
  let target;
  const queue = [];
  const seen = new Set();
  const map = lines.map((line, y) =>
    [...line].map((char, x) => {
      if (char === "S" || (part === 2 && char === "a")) {
        queue.push({ x, y, cost: 0 });
        return 0;
      } else if (char === "E") {
        target = { x, y };
        return 25;
      } else {
        return char.charCodeAt() - 97;
      }
    })
  );

  const isValidStep = (fromX, fromY, toX, toY) => {
    if (!(toX >= 0 && toX < map[0].length && toY >= 0 && toY < map.length)) {
      return false;
    }
    return !seen.has(`${toX},${toY}`) && map[toY][toX] <= map[fromY][fromX] + 1;
  };

  while (queue[0].x !== target.x || queue[0].y !== target.y) {
    const { x, y, cost } = queue.shift();
    if (!seen.has(`${x},${y}`)) {
      // up
      if (isValidStep(x, y, x, y - 1)) {
        queue.push({ x, y: y - 1, cost: cost + 1 });
      }
      // down
      if (isValidStep(x, y, x, y + 1)) {
        queue.push({ x, y: y + 1, cost: cost + 1 });
      }
      // left
      if (isValidStep(x, y, x - 1, y)) {
        queue.push({ x: x - 1, y, cost: cost + 1 });
      }
      // right
      if (isValidStep(x, y, x + 1, y)) {
        queue.push({ x: x + 1, y, cost: cost + 1 });
      }
      seen.add(`${x},${y}`);
    }
  }

  console.log(`Part ${part}:`, queue[0].cost);
}
