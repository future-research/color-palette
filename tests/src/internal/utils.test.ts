// @ts-nocheck

import { deepFreeze } from '../../../src/internal/utils'
import { getValueWithDateNow } from '../../helpers'

// npm run test -- internal/utils.test.ts
describe('internal: utils', () => {
  describe('#deepFreeze()', () => {
    class Something {}

    it('should prevent the addition of fields onto a frozen object or its prototype', () => {
      const fieldA = getValueWithDateNow('x')

      expect(() => {
        Something[fieldA] = 1
      }).not.toThrow()

      deepFreeze(Something)

      const fieldB = getValueWithDateNow('x')
      const fieldC = getValueWithDateNow('z')

      expect(() => {
        Something[fieldB] = 5
      }).toThrow(`Cannot add property ${fieldB}, object is not extensible`)

      expect(Something.x).toEqual(undefined)

      expect(() => {
        Something.prototype[fieldC] = 3
      }).toThrow(`Cannot add property ${fieldC}, object is not extensible`)

      expect(Something.prototype.z).toEqual(undefined)
    })
  })
})
