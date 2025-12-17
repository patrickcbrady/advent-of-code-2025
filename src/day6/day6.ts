import { getInputsWithWhitespace } from "../utils";

function doOperations(matrix: string[][]) {
  const answers = []
  for (let j = 0; j < matrix[0]!.length; j++) {
    const operator = matrix[matrix.length - 1]![j]! as ('+' | '*')
    let answer = operator === '+' ? 0 : 1
    for (let i = 0; i < matrix.length - 1; i++) {
      if (operator === '+') {
        answer+= Number.parseInt(matrix[i]![j]!)
      } else {
        answer = answer * Number.parseInt(matrix[i]![j]!)
      }
    }
    answers.push(answer)
  }
  console.log(answers)
  return answers.reduce((agg, curr) => {
    return agg + curr
  }, 0)
}

function readNumber(problemSheet: string[], column: number) {
  const digits = []
  for (const row of problemSheet.slice(0, -1)) {
    if(row[column] && row[column] !== ' ') {
      digits.push(row[column])
    }
  }
  if (!digits.length) {
    return undefined
  }
  return Number.parseInt(digits.join(''))
}

function doMath(operator: '*' | '+', operands: number[]) {
  return operands.reduce((agg, curr) => {
    return operator === '*' ? agg * curr : agg + curr
  }, operator === '*' ? 1: 0)
}

function doProblemSheet(problemSheet: string[]) {
  const answers: number[] = []
  const maxCol = Math.max(...problemSheet.map(s => s.length)) - 1
  let operands: number[] = []
  for (let c = maxCol; c >= 0; c--) {
    const number = readNumber(problemSheet, c)
    if (!number) {
      continue
    }
    operands.push(number)
    const operator = problemSheet[problemSheet.length - 1]?.charAt(c)
    if (operator === '+' || operator === '*') {
      answers.push(doMath(operator, operands))
      operands = []
    }
  }
  return answers.reduce((agg, curr) => {
    return agg + curr
  }, 0)
}

async function main() {
  const input = await getInputsWithWhitespace('input', '\n')
  console.log(doProblemSheet(input))
  // const matrix = input.map((row) => row.split(' ').filter(e => e !== ''))
  // console.log(matrix)
  // const sum = doOperations(matrix)
  // console.log(sum)

}

void main()