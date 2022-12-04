const fs = require("fs");

const lines = fs.readFileSync("../input.txt", "utf8").trim().split("\n");
const ranges = lines.map((line) => {
  const [left, right] = line.split(",");
  const [leftLow, leftHigh] = left.split("-").map(Number);
  const [rightLow, rightHigh] = right.split("-").map(Number);
  return {
    leftLow,
    leftHigh,
    rightLow,
    rightHigh,
  };
});
const overlaps = ranges.filter(
  range =>
    (range.leftLow >= range.rightLow && range.leftHigh <= range.rightHigh) ||
    (range.rightLow >= range.leftLow && range.rightHigh <= range.leftHigh)
);
console.log("Part 1:", overlaps.length);

const partialOverlaps = ranges.filter(
  range =>
    (range.leftLow >= range.rightLow && range.leftLow <= range.rightHigh) ||
    (range.leftHigh <= range.rightHigh && range.leftHigh >= range.rightLow) ||
    (range.rightLow >= range.leftLow && range.rightLow <= range.leftHigh) ||
    (range.rightHigh <= range.leftHigh && range.rightHigh >= range.leftLow)
);
console.log("Part 2:", partialOverlaps.length);
