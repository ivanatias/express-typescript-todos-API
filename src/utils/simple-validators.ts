export const isString = (string: string): boolean => {
  return typeof string === 'string'
}

export const isNumber = (number: number): boolean => {
  return typeof number === 'number'
}

export const isBoolean = (boolean: boolean): boolean => {
  return typeof boolean === 'boolean'
}

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date))
}

export const assertNonNullable = <T>(value: T | null | undefined) => {
  if (value === null || value === undefined) {
    throw new Error(`Variable cannot be ${String(value)}`)
  }

  return value
}
