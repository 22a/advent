const fs = require("fs");

const lines = fs.readFileSync("../input.txt", "utf8").trim().split("\n");
const instructions = lines.map((line) => {
  if (line === "noop") {
    return { instruction: "noop" };
  } else {
    const [instruction, value] = line.split(" ");
    return { instruction, value: Number(value) };
  }
});
let x = 1;
let cycle = 0;
let signalStrength = 0;
let frameBuffer = "";
const compute = () => {
  if ((cycle + 20) % 40 === 0) {
    signalStrength += cycle * x;
  }
};
const paint = () => {
  frameBuffer += Math.abs(x - (cycle % 40)) < 2 ? "#" : ".";
};
for (let { instruction, value } of instructions) {
  if (instruction === "noop") {
    paint();
    cycle++;
    compute();
  } else {
    paint();
    cycle++;
    compute();
    paint();
    cycle++;
    compute();
    x += value;
  }
}
console.log("Part 1:", signalStrength);

console.log("Part 2:");
for (let i = 0; i < 240; i += 40) {
  console.log(frameBuffer.substring(i, i + 40));
}
