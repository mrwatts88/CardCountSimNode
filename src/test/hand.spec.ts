import { expect } from 'chai'
import 'mocha'
import { Card, Suit } from '../lib/card'
import { Hand } from '../lib/hand'

describe('Test Hand', () => {
  let hand: Hand
  const suit: Suit = Card.Suits.C

  beforeEach(() => {
    hand = new Hand()
  })

  it('should have 4 cards', () => {
    hand.addCardToHand(new Card(suit, 5))
    hand.addCardToHand(new Card(suit, 5))
    hand.addCardToHand(new Card(suit, 5))
    hand.addCardToHand(new Card(suit, 5))
    expect(hand.numCards()).to.equal(4)
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

  it('should have an Ace', () => {
    hand.addCardToHand(new Card(suit, 1))
    expect(hand.hasAce()).to.equal(true)
  })

  it('should NOT have an Ace', () => {
    hand.addCardToHand(new Card(suit, 11))
    expect(hand.hasAce()).to.equal(false)
  })

  it('should be soft with multiple Aces', () => {
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    expect(hand.isSoft()).to.equal(true)
  })

  it('should be soft', () => {
    hand.addCardToHand(new Card(suit, 6))
    hand.addCardToHand(new Card(suit, 1))
    expect(hand.isSoft()).to.equal(true)
  })

  it('should NOT be soft with multiple Aces', () => {
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 1))
    expect(hand.isSoft()).to.equal(false)
  })

  it('should NOT be soft', () => {
    hand.addCardToHand(new Card(suit, 9))
    hand.addCardToHand(new Card(suit, 8))
    hand.addCardToHand(new Card(suit, 1))
    expect(hand.isSoft()).to.equal(false)
  })

  it('should be a pair', () => {
    hand.addCardToHand(new Card(suit, 3))
    hand.addCardToHand(new Card(suit, 3))
    expect(hand.isPair()).to.equal(true)
  })

  it('should NOT be a pair', () => {
    hand.addCardToHand(new Card(suit, 3))
    hand.addCardToHand(new Card(suit, 7))
    expect(hand.isPair()).to.equal(false)
  })

  it('should total 21', () => {
    hand.addCardToHand(new Card(suit, 6))
    hand.addCardToHand(new Card(suit, 6))
    hand.addCardToHand(new Card(suit, 6))
    hand.addCardToHand(new Card(suit, 3))
    expect(hand.calcHandTotal()).to.equal(21)
  })

  it('should total soft 17 with an Ace', () => {
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 6))
    expect(hand.calcHandTotal()).to.equal(17)
  })

  it('should total hard 17 with an Ace', () => {
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 10))
    hand.addCardToHand(new Card(suit, 6))
    expect(hand.calcHandTotal()).to.equal(17)
  })

  it('should contain the added card', () => {
    const card1: Card = new Card(suit, 1)
    const card2: Card = new Card(suit, 10)
    const card3: Card = new Card(suit, 6)

    hand.addCardToHand(card1)
    hand.addCardToHand(card2)
    hand.addCardToHand(card3)

    expect(hand.getCardAt(0)).to.equal(card1)
    expect(hand.getCardAt(1)).to.equal(card2)
    expect(hand.getCardAt(2)).to.equal(card3)
  })

  it('should have blackjack', () => {
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 11))
    expect(hand.hasBlackjack()).to.equal(true)
  })

  it('should NOT have blackjack', () => {
    hand.addCardToHand(new Card(suit, 1))
    hand.addCardToHand(new Card(suit, 7))
    expect(hand.hasBlackjack()).to.equal(false)
  })

  it('should have an empty hand', () => {
    hand.addCardToHand(new Card(suit, 1))
    hand.clearHand()
    expect(hand.numCards()).to.equal(0)
  })
})
