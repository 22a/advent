const fs = require("fs");

const lines = fs.readFileSync("../input.txt", "utf8").trim().split("\n");
const tree = {
  name: "/",
  childDirs: [],
  files: [],
  parent: null,
};
let cd;
for (let line of lines) {
  if (line.startsWith("$ cd")) {
    const dir = line.substring(5);
    if (dir === "/") {
      cd = tree;
    } else if (dir === "..") {
      cd = cd.parent;
    } else {
      const existingChild = cd.childDirs.find(
        (childDir) => childDir.name === dir
      );
      if (existingChild) {
        cd = existingChild;
      } else {
        const newChildDir = { name: dir, childDirs: [], files: [], parent: cd };
        cd.childDirs.push(newChildDir);
        cd = newChild;
      }
    }
  } else if (line.startsWith("$ ls")) {
    // do nothing, we're in the right dir and will read the next lines as children
  } else {
    const [size, name] = line.split(" ");
    if (size === "dir") {
      if (!cd.childDirs.some((childDir) => childDir.name === name)) {
        cd.childDirs.push({ name, childDirs: [], files: [], parent: cd });
      }
    } else {
      cd.files.push({ name, size: Number(size) });
    }
  }
}
let sizeSub100k = 0;
const attachSizes = (dir) => {
  dir.childDirs.forEach(attachSizes);
  const sizeOfFiles = dir.files.reduce((acc, file) => acc + file.size, 0);
  const sizeOfSubdirs = dir.childDirs.reduce((acc, childDir) => acc + childDir.totalSize, 0);
  const totalSize = sizeOfFiles + sizeOfSubdirs;
  dir.totalSize = totalSize;
  if (totalSize <= 100_000) {
    sizeSub100k += totalSize;
  }
};
attachSizes(tree);
console.log("Part 1:", sizeSub100k);

const freeSpace = 70_000_000 - tree.totalSize;
const needToFree = 30_000_000 - freeSpace;
let bestCandidateDirSize = Infinity;
const walk = (dir) => {
  dir.childDirs.forEach(walk);
  if (dir.totalSize >= needToFree && dir.totalSize < bestCandidateDirSize) {
    bestCandidateDirSize = dir.totalSize;
  }
};
walk(tree);
console.log("Part 2:", bestCandidateDirSize);
