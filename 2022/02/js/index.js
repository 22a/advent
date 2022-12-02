const fs = require("fs");

const matches = fs.readFileSync("../input.txt", "utf8").trim().split("\n");
const matchMoves = matches.map((moveStr) => ({
  theirs: moveStr.charCodeAt(0) - 64,
  yours: moveStr.charCodeAt(2) - 87,
}));
const yourScoresFromMatchMoves = matchMoves.map(({ yours, theirs }) => {
  const youWon = (yours > theirs && !(yours - theirs === 2)) || theirs - yours === 2;
  const resultScore = yours === theirs ? 3 : youWon ? 6 : 0;
  return yours + resultScore;
});
const yourTotal = yourScoresFromMatchMoves.reduce((a, b) => a + b, 0);
console.log("Part 1:", yourTotal);

// we've now retconned `yours` to mean your desired result, 1=loss,2=draw,3=win
const yourScoresFromFixedMatches = matchMoves.map(
  ({ yours: desiredResult, theirs }) => {
    let yours;
    if (desiredResult === 1) {
      yours = {
        1: 3,
        2: 1,
        3: 2,
      }[theirs];
    } else if (desiredResult === 2) {
      yours = theirs;
    } else {
      yours = {
        1: 2,
        2: 3,
        3: 1,
      }[theirs];
    }
    const youWon = (yours > theirs && !(yours - theirs === 2)) || theirs - yours === 2;
    const resultScore = yours === theirs ? 3 : youWon ? 6 : 0;
    return yours + resultScore;
  }
);
const riggedTotal = yourScoresFromFixedMatches.reduce((a, b) => a + b, 0);
console.log("Part 2:", riggedTotal);
