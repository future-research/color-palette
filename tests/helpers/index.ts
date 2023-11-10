export const getValueWithDateNow = (value: string | number = '') => {
  return `${value}${Date.now()}${Math.floor(Math.random() * 1000)}`
}

export const clearAllMocks = () => {
  jest.resetAllMocks()
  jest.clearAllMocks()
}
