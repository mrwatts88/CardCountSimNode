import { expect } from 'chai'
import * as _ from 'lodash'
import 'mocha'
import Card from '../lib/card'
import Deck from '../lib/deck'

const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

describe('Test Deck', () => {
  let deck

  beforeEach(() => {
    deck = new Deck()
    deck.init()
  })

  it('should initilize', () => {
    expect(deck.isEmpty()).to.equal(false)
  })

  it('should be in order after init()', () => {
    let inOrder: boolean = true
    let i = 0

    while (!deck.isEmpty()) {
      const cardValue = deck.dealCard().value
      if (cardValue !== values[i]) {
        inOrder = false
        break
      }
      if (++i >= 13) i = 0
    }

    expect(inOrder).to.equal(true)
  })

  it('should deal a Card object', () => {
    const card = deck.dealCard()
    expect(card).to.be.instanceof(Card)
    expect(_.isEqual(card, new Card(Card.Suits.C, 1))).to.equal(true)
  })

  it('should deal 52 cards', () => {
    let i = 0
    while (!deck.isEmpty()) {
      deck.dealCard()
      ++i
    }

    expect(i).to.equal(52)
    expect(deck.isEmpty()).to.equal(true)
  })

  it('should shuffle the cards', () => {
    deck.shuffle()
    let inOrder: boolean = true
    let i = 0

    while (!deck.isEmpty()) {
      const cardValue = deck.dealCard().value
      if (cardValue !== values[i]) {
        inOrder = false
        break
      }
      if (++i >= 13) i = 0
    }

    expect(inOrder).to.equal(false)
  })
})
