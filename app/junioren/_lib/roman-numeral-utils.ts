/**
 * Utility functions for Roman numeral conversion and title parsing
 */

/**
 * Convert a Roman numeral to an integer
 */
export function romanToInt(roman: string): number {
  const romanNumerals: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  }

  let result = 0
  let prevValue = 0

  for (let i = roman.length - 1; i >= 0; i--) {
    const currentValue = romanNumerals[roman[i].toUpperCase()]
    if (currentValue) {
      if (currentValue < prevValue) {
        result -= currentValue
      } else {
        result += currentValue
      }
      prevValue = currentValue
    }
  }

  return result
}

/**
 * Extract Roman numeral from a string and convert to integer
 */
export function extractRomanNumber(text: string): number | null {
  const romanMatch = text.match(/[IVXLCDM]+/i)
  if (romanMatch) {
    return romanToInt(romanMatch[0])
  }
  return null
}

/**
 * Parse training title to extract structured information
 */
export function parseTrainingTitle(title: string) {
  const romanNumber = extractRomanNumber(title)
  const cleanTitle = title.replace(/[IVXLCDM]+/i, '').trim()

  return {
    title: cleanTitle,
    romanNumber,
    originalTitle: title,
  }
}