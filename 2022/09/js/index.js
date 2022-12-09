const fs = require("fs");

const lines = fs.readFileSync("../input.txt", "utf8").trim().split("\n");
const moves = lines.map((line) => {
  const [dir, dist] = line.split(" ");
  return { dir, dist: Number(dist) };
});
let head = { x: 0, y: 0 };
let tail = { x: 0, y: 0 };
let tailVisited = new Set();
const follow = (lead, follower) => {
  const xDist = Math.abs(lead.x - follower.x);
  const yDist = Math.abs(lead.y - follower.y);
  if (xDist > 1) {
    if (lead.x > follower.x) {
      follower.x++;
    } else {
      follower.x--;
    }
    if (yDist === 1) {
      follower.y = lead.y;
    }
  }
  if (yDist > 1) {
    if (lead.y > follower.y) {
      follower.y++;
    } else {
      follower.y--;
    }
    if (xDist === 1) {
      follower.x = lead.x;
    }
  }
};
for (let move of moves) {
  for (let i = 0; i < move.dist; i++) {
    if (move.dir === "U") {
      head.y++;
    } else if (move.dir === "D") {
      head.y--;
    } else if (move.dir === "L") {
      head.x--;
    } else if (move.dir === "R") {
      head.x++;
    }
    follow(head, tail);
    tailVisited.add(`${tail.x},${tail.y}`);
  }
}
console.log("Part 1:", tailVisited.size);

head = { x: 0, y: 0 };
let rope = new Array(9);
for (let i = 0; i < 9; i++) {
  rope[i] = { x: 0, y: 0 };
}
tailVisited = new Set();
for (let move of moves) {
  for (let i = 0; i < move.dist; i++) {
    if (move.dir === "U") {
      head.y++;
    } else if (move.dir === "D") {
      head.y--;
    } else if (move.dir === "L") {
      head.x--;
    } else if (move.dir === "R") {
      head.x++;
    }
    follow(head, rope[0]);
    follow(rope[0], rope[1]);
    follow(rope[1], rope[2]);
    follow(rope[2], rope[3]);
    follow(rope[3], rope[4]);
    follow(rope[4], rope[5]);
    follow(rope[5], rope[6]);
    follow(rope[6], rope[7]);
    follow(rope[7], rope[8]);
    tailVisited.add(`${rope[8].x},${rope[8].y}`);
  }
}
console.log("Part 2:", tailVisited.size);
