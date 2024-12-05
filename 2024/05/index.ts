import { readInput } from '../utils/readInput.ts';
const input = readInput(import.meta.url, process.argv.includes('--example'));

const [orderingsStr, updatesStr] = input.split('\n\n');
const orderings = orderingsStr
  .split('\n')
  .map((line) => line.split('|').map(Number))
  .reduce((acc, ordering) => {
    acc[ordering[1]] = [...(acc[ordering[1]] ?? []), ordering[0]];
    return acc;
  }, {});
const updates = updatesStr.split('\n').map((line) => line.split(',').map(Number));

const isInCorrectOrder = (orderings: Record<number, number[]>, update: number[]) => {
  for (let i = 0; i < update.length; i++) {
    const page = update[i];
    const mustAppearAfter = orderings[page];
    if (mustAppearAfter) {
      for (let j = i + 1; j < update.length; j++) {
        if (mustAppearAfter.includes(update[j])) {
          return false;
        }
      }
    }
  }
  return true;
};

const correctUpdates = updates.filter((update) => isInCorrectOrder(orderings, update));
const sumOfCorrectUpdateMidpoints = correctUpdates
  .map((update) => update[Math.floor(update.length / 2)])
  .reduce((sum, n) => sum + n, 0);
console.log('Part 1:', sumOfCorrectUpdateMidpoints);

const reorderUpdate = (update: number[]) => {
  let reorderedUpdate: number[] = [];
  let remainder = [...update];
  while (remainder.length > 0) {
    let pushCandidate = remainder[0];
    while (pushCandidate) {
      let mustAppearAfter = orderings[pushCandidate];
      if (!mustAppearAfter) {
        break;
      }
      let betterCandidateInRemainder = remainder.find((candidate) => mustAppearAfter.includes(candidate));
      if (betterCandidateInRemainder) {
        pushCandidate = betterCandidateInRemainder;
      } else {
        break;
      }
    }
    reorderedUpdate.push(pushCandidate);
    remainder = remainder.filter((page) => page !== pushCandidate);
  }
  return reorderedUpdate;
};

const incorrectUpdates = updates.filter((update) => !isInCorrectOrder(orderings, update));
const reorderedIncorrectUpdates = incorrectUpdates.map(reorderUpdate);
const sumOfReorderedUpdateMidpoints = reorderedIncorrectUpdates
  .map((update) => update[Math.floor(update.length / 2)])
  .reduce((sum, n) => sum + n, 0);
console.log('Part 2:', sumOfReorderedUpdateMidpoints);
