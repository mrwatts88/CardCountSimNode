import { expect } from 'chai'
import 'mocha'
import { Card } from '../lib/card'
import { Participant } from '../lib/participant'
import { Player } from '../lib/player'
import { SIX_DECK_H17_DAS_NO_SURR } from '../lib/strategy'

const {
  actions: { HIT, STAND, SPLIT, DOUBLE, DS },
} = Participant

describe('Test Player', () => {
  let player
  beforeEach(() => {
    player = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
    ])
  })

  it('should split 3s against 7 or less', () => {
    player.addCardToInitialHand(new Card(0, 3))
    player.addCardToInitialHand(new Card(3, 3))
    expect(player.decideAction(2, 2)).to.equal(SPLIT)
    expect(player.decideAction(2, 3)).to.equal(SPLIT)
    expect(player.decideAction(2, 4)).to.equal(SPLIT)
    expect(player.decideAction(2, 5)).to.equal(SPLIT)
    expect(player.decideAction(2, 6)).to.equal(SPLIT)
    expect(player.decideAction(2, 7)).to.equal(SPLIT)
    expect(player.decideAction(2, 8)).to.equal(HIT)
    expect(player.decideAction(2, 9)).to.equal(HIT)
    expect(player.decideAction(2, 10)).to.equal(HIT)
    expect(player.decideAction(2, 11)).to.equal(HIT)
  })
})
