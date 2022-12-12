const fs = require("fs");

const monkeyStrs = fs.readFileSync("../input.txt", "utf8").trim().split("\n\n");

for (let [part, roundN] of [[1, 20], [2, 10000]]) {
  const monkeys = monkeyStrs.map((str) => {
    let [_id, startingStr, operationStr, testStr, trueStr, falseStr] =
      str.split("\n");
    let [_old, operator, operand] = operationStr.split(" = ")[1].split(" ");
    return {
      items: startingStr.split(": ")[1].split(", ").map(Number),
      operator,
      operand: Number(operand),
      divTest: Number(testStr.split(" by ")[1]),
      trueTarget: Number(trueStr[trueStr.length - 1]),
      falseTarget: Number(falseStr[falseStr.length - 1]),
      itemsInspected: 0,
    };
  });
  let productOfPrimeTests = monkeys.reduce((acc, monkey) => acc * monkey.divTest, 1);
  for (let round = 0; round < roundN; round++) {
    for (let monkey of monkeys) {
      while (monkey.items.length) {
        monkey.itemsInspected++;
        let item = monkey.items.shift();
        if (monkey.operator === "+") {
          item += monkey.operand || item;
        } else if (monkey.operator === "*") {
          item *= monkey.operand || item;
        }
        if (part === 1) {
          item = Math.floor(item / 3);
        } else {
          item %= productOfPrimeTests;
        }
        if (item % monkey.divTest === 0) {
          monkeys[monkey.trueTarget].items.push(item);
        } else {
          monkeys[monkey.falseTarget].items.push(item);
        }
      }
    }
  }
  const sortedInspections = monkeys.map((monkey) => monkey.itemsInspected).sort((a, b) => b - a);
  console.log(`Part ${part}:`, sortedInspections[0] * sortedInspections[1]);
}
