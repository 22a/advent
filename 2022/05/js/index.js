const fs = require("fs");

const [crateStr, movesStr] = fs.readFileSync("../input.txt", "utf8").split("\n\n");
const crateStrs = crateStr.split("\n");
const crateNumsStr = crateStrs[crateStrs.length - 1];
const crates = [];
for (let col = 0; col < crateNumsStr.length - 1; col++) {
  if (Number(crateNumsStr[col])) {
    const crate = [];
    for (let row = 0; row < crateStrs.length - 1; row++) {
      let item = crateStrs[row][col];
      if (item && item !== " ") {
        crate.push(item);
      }
    }
    crates.push(crate);
  }
}
// lazyily adding this for part 2 bc part 1's solution mangles `crates`
const crates2 = JSON.parse(JSON.stringify(crates));
const moveLines = movesStr.trim().split("\n");
const moves = moveLines.map((line) => {
  const [_move, count, _from, source, _to, dest] = line.split(" ").map(Number);
  return { count, source, dest };
});
for (let { count, source, dest } of moves) {
  for (let i = 0; i < count; i++) {
    crates[dest - 1].unshift(crates[source - 1].shift());
  }
}
const tops = crates.reduce((acc, i) => acc + i[0], "");
console.log("Part 1:", tops);

for (let { count, source, dest } of moves) {
  crates2[dest - 1].unshift(...crates2[source - 1].splice(0, count));
}
const tops2 = crates2.reduce((acc, i) => acc + i[0], "");
console.log("Part 2:", tops2);
