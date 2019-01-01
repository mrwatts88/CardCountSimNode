import { expect } from 'chai'
import 'mocha'
import { Card } from '../lib/card'
import { Shoe } from '../lib/shoe'

describe('Test Shoe', () => {
  let shoe: Shoe

  beforeEach(() => {
    shoe = new Shoe(6, 52, hiLoCountMap)
    shoe.shuffle()
  })

  it('should initilize', () => {
    expect(shoe.isEmpty()).to.equal(false)
  })

  it('should deal a Card object', () => {
    const card: Card = shoe.dealCard()
    expect(card).to.be.instanceof(Card)
  })

  it('should deal 312 cards', () => {
    let i: number = 0
    while (!shoe.isEmpty()) {
      shoe.dealCard()
      ++i
    }

    expect(i).to.equal(312)
    expect(shoe.isEmpty()).to.equal(true)
  })

  it('should set countMap', () => {
    shoe.setCountMap(hiLoCountMap)
    expect(shoe.getCountMap()[5]).to.equal(1)
  })

  it('test calcTrueCount()', () => {
    // TODO
  })

  it('should have reached cut card', () => {
    let i: number = 0
    while (i++ < 260) shoe.dealCard()
    expect(shoe.hasReachedCutCard()).to.equal(true)
  })

  it('should NOT have reached cut card', () => {
    let i: number = 0
    while (i++ < 259) shoe.dealCard()
    expect(shoe.hasReachedCutCard()).to.equal(false)
  })
})

const hiLoCountMap = {
  1: -1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 0,
  8: 0,
  9: 0,
  10: -1,
  11: -1,
  12: -1,
  13: -1,
}
