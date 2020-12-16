const fs = require('fs')
const groups = fs.readFileSync('../input.txt', 'utf8').trim().split('\n\n')

const groupToUniqueQuestionCount = group => {
  const answeredQuestions = new Set()
  ;[...group].forEach(question => {
    if (question !== '\n') {
      answeredQuestions.add(question)
    }
  })
  return Array.from(answeredQuestions).length
}

const counts = groups.map(groupToUniqueQuestionCount)
const countsSum = counts.reduce((acc, i) => acc + i)
console.log('Part 1:', countsSum)

const groupToFullQuorumCount = group => {
  const individuals = group.split('\n')
  const answerCounts = individuals.reduce((acc, individualAnswers) => {
    ;[...individualAnswers].forEach(questionId => {
      acc[questionId] = acc[questionId] ? acc[questionId] + 1 : 1
    })
    return acc
  }, {})
  const questionsEveryoneAnswered = Object.entries(answerCounts).filter(
    ([_key, val]) => val === individuals.length
  )
  return questionsEveryoneAnswered.length
}

const quorumCounts = groups.map(groupToFullQuorumCount)
const quorumCountsSum = quorumCounts.reduce((acc, i) => acc + i)
console.log('Part 2:', quorumCountsSum)
