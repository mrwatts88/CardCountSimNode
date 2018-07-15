import { expect } from 'chai'
import 'mocha'
import Card from '../lib/card'
import Hand from '../lib/hand'

describe('Test Hand', () => {
  let hand
  const suit = Card.Suits.C

  beforeEach(() => {
    hand = new Hand()
  })

  it('should be soft with Ace valued as 11', () => {
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 5))
    hand.addCardToHand(new Card(suit, 4))
    expect(hand.isSoft()).to.equal(true)
  })

  it('should be hard with all Aces valued as 1', () => {
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 8))
    hand.addCardToHand(new Card(suit, 4))
    expect(hand.isSoft()).to.equal(false)
  })
})
