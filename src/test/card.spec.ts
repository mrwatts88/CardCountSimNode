import { expect } from 'chai'
import 'mocha'
import Card from '../lib/card'

describe('Test Card', () => {
  let card
  let cards
  const suit = Card.Suits.C
  const val = 1
  const stringVal = 'AC'

  beforeEach(() => {
    card = new Card(suit, val)
    cards = []
    for (let i = 1; i <= 13; i++) cards.push(new Card(Card.Suits.C, i))
  })

  it('should construct with suit and value', () => {
    expect(card.suit).to.equal(suit)
    expect(card.value).to.equal(val)
  })

  it('should display val as string', () => {
    expect(card.toString()).to.equal(stringVal)
  })

  it('should convert numeric value to string', () => {
    const stringVals = [
      'A',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'T',
      'J',
      'Q',
      'K',
    ]
    for (let i = 0; i < cards.length; ++i)
      expect(cards[i].valAsString()).to.equal(stringVals[i])
  })

  it('should convert num representation to face value', () => {
    const faceVals = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
    for (let i = 0; i < cards.length; ++i)
      expect(cards[i].valAsInt()).to.equal(faceVals[i])
  })
})
