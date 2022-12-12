const fs = require("fs");

const chars = fs.readFileSync("../input.txt", "utf8").trim().split("");
const charsUntilUniqBuffer = (bufferLength) => {
  const buffer = [null];
  for (let i = 0; i < bufferLength - 1; i++) {
    buffer.push(chars[i]);
  }
  for (let i = bufferLength - 1; i < chars.length; i++) {
    buffer.shift();
    buffer.push(chars[i]);
    const scratch = new Set();
    for (const char of buffer) {
      scratch.add(char);
    }
    if (scratch.size === bufferLength) {
      return i + 1;
    }
  }
};
console.log("Part 1:", charsUntilUniqBuffer(4));
console.log("Part 2:", charsUntilUniqBuffer(14));
