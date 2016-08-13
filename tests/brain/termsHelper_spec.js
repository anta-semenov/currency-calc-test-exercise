import getTerms from '../../src/helpers/terms'
import { expect } from 'chai'

const date = new Date(2016,3,4)

describe('terms', () => {
  it('return empty array', () => {
    expect(getTerms(date)).to.deep.equal([])
  })
  it('return array for future with default intervals', () => {
    const result = [
      new Date(2016,6,4).getTime(),
      new Date(2016,9,4).getTime(),
      new Date(2016,12,4).getTime(),
      new Date(2017,3,4).getTime()
    ]

    expect(getTerms(date, true)).to.deep.equal(result)
  })
  it('return array for future with custom intervals', () => {
    const result = [
      new Date(2016,9,4).getTime(),
      new Date(2017,3,4).getTime(),
      new Date(2017,9,4).getTime(),
      new Date(2018,3,4).getTime()
    ]
    const future = {count:4, monthInterval: 6}

    expect(getTerms(date, future)).to.deep.equal(result)
  })
  it('return array for past with default intervals', () => {
    const result = [
      new Date(2014,3,4).getTime(),
      new Date(2014,4,4).getTime(),
      new Date(2014,5,4).getTime(),
      new Date(2014,6,4).getTime(),
      new Date(2014,7,4).getTime(),
      new Date(2014,8,4).getTime(),
      new Date(2014,9,4).getTime(),
      new Date(2014,10,4).getTime(),
      new Date(2014,11,4).getTime(),
      new Date(2014,12,4).getTime(),
      new Date(2015,1,4).getTime(),
      new Date(2015,2,4).getTime(),
      new Date(2015,3,4).getTime(),
      new Date(2015,4,4).getTime(),
      new Date(2015,5,4).getTime(),
      new Date(2015,6,4).getTime(),
      new Date(2015,7,4).getTime(),
      new Date(2015,8,4).getTime(),
      new Date(2015,9,4).getTime(),
      new Date(2015,10,4).getTime(),
      new Date(2015,11,4).getTime(),
      new Date(2015,12,4).getTime(),
      new Date(2016,1,4).getTime(),
      new Date(2016,2,4).getTime()
    ]
    expect(getTerms(date, false, true)).to.deep.equal(result)
  })
  it('return array for past with custom intervals', () => {
    const result = [
      new Date(2014,9,4).getTime(),
      new Date(2015,3,4).getTime(),
      new Date(2015,9,4).getTime()
    ]
    const past = {count:3, monthInterval: 6}

    expect(getTerms(date, false, past)).to.deep.equal(result)
  })
})
