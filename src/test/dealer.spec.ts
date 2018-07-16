import 'mocha'
import { expect } from 'chai'
import Card from '../lib/card'
import Dealer from '../lib/dealer'
import Participant from '../lib/participant'

describe('Test Dealer', () => {
  let dealer
  beforeEach(() => {
    dealer = new Dealer()
  })

  it('should HIT with Ace', () => {
    dealer.addCardToHand(new Card(1, 1))
    dealer.addCardToHand(new Card(1, 3))
    expect(dealer.decideAction(false)).to.equal(Participant.actions.HIT)
  })

  it('should STAND with Ace', () => {
    dealer.addCardToHand(new Card(1, 1))
    dealer.addCardToHand(new Card(1, 9))
    expect(dealer.decideAction(false)).to.equal(Participant.actions.STAND)
  })

  it('should HIT without Ace', () => {
    dealer.addCardToHand(new Card(1, 6))
    dealer.addCardToHand(new Card(1, 9))
    expect(dealer.decideAction(false)).to.equal(Participant.actions.HIT)
  })

  it('should STAND without Ace', () => {
    dealer.addCardToHand(new Card(1, 8))
    dealer.addCardToHand(new Card(1, 9))
    expect(dealer.decideAction(false)).to.equal(Participant.actions.STAND)
  })
})
