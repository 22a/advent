const fs = require("fs");

const lines = fs.readFileSync("../input.txt", "utf8").trim().split("\n");
const bags = lines.map((line) => {
  const left = {}, right = {};
  [...line].forEach((char, i) => {
    const bag = i >= line.length / 2 ? right : left;
    bag[char] = bag[char] ? bag[char] + 1 : 1;
  });
  return { left, right };
});
const intersections = bags.flatMap((bag) =>
  Object.keys(bag.left).filter((i) => bag.right[i])
);
const charToPrio = (char) => {
  const charCode = char.charCodeAt();
  if (charCode < 96) {
    return charCode - 38; // "A"=65, -38 -> 27
  } else {
    return charCode - 96; // "a"=97, -96 -> 1
  }
};
const prioOfDupes = intersections.map(charToPrio).reduce((a, b) => a + b, 0);
console.log("Part 1:", prioOfDupes);

// we're depleting lines here, but we don't care
const groups = [...Array(Math.ceil(lines.length / 3))].map((_) =>
  lines.splice(0, 3)
);
const badges = groups.flatMap((group) => {
  const sets = group.map((bag) => new Set([...bag]));
  const intersection = [...sets[0]].filter(
    (char) => sets[1].has(char) && sets[2].has(char)
  );
  return intersection;
});
const prioOfBadges = badges.map(charToPrio).reduce((a, b) => a + b, 0);
console.log("Part 2:", prioOfBadges);
