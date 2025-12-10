import { getInputs } from "../utils";

/**
 * get the largest sequence of numDigits in the provided bank of digits
 * @param bank
 * @param numDigits
 */
function getMaxJoltage(bank: string, numDigits: number) {
  let searchStart = 0
  const digits: number[] = []
  for (let i = numDigits; i > 0; i--) {
    let maxDigit = 0
    let maxDigitIdx = searchStart
    for (let j = searchStart; j <= (bank.length - i); j++) {
      const digitStr = bank[j]
      if (!digitStr) {
        throw Error()
      }
      const digit = Number.parseInt(digitStr)
      if (digit > maxDigit) {
        maxDigit = digit
        maxDigitIdx = j
      }
    }
    digits.push(maxDigit)
    searchStart = maxDigitIdx + 1
  }
  return Number.parseInt(digits.join(''))
}




async function main() {
  const batteryBanks = await getInputs('input', '\n')
  const joltageSum = batteryBanks.reduce((agg, curr) => {
    return agg + getMaxJoltage(curr, 12)
  }, 0)
  console.log(`The sum of max joltages is ${joltageSum}`)
}

void main()