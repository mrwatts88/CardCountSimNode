import { expect } from 'chai'
import 'mocha'
import Card from '../lib/card'
import Game from '../lib/game'
import Player from '../lib/player'
import { SIX_DECK_H17_DAS_NO_SURR } from '../lib/strategy'

describe('Test Game', () => {
  let game1: Game
  let player1: Player
  let game2: Game
  let player2: Player

  beforeEach(() => {
    game1 = new Game({ h17: true })
    player1 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
    ])

    game2 = new Game({ h17: true })
    player2 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
    ])
  })

  it('should have a dealer', () => {
    expect(game1.getDealer()).to.not.equal(undefined)
  })

  it('test shuffleShoe', () => {
    game1.shuffleShoe()
    // TODO: assertion
  })

  it('should add Player', () => {
    // TODO: Make sure player isn't in another game
    game1.addPlayer(player1)
    game2.addPlayer(player2)
    expect(game1.getPlayerAt(1)).to.equal(player1)
    expect(game1.getNumPlayers()).to.equal(1)
  })

  it('should place bets', () => {
    game1.addPlayer(player1)
    game1.placeBets()
    expect(game1.getPlayerAt(1).currentBet).to.equal(1)
  })

  it('test dealRound', () => {
    game1.addPlayer(player1)
    game1.dealRound()
    // TODO: assertion
  })

  it('give player and dealer blackjack', () => {
    game2.dealer.addCardToHand(new Card(0, 1))
    game2.dealer.addCardToHand(new Card(0, 10))

    player2.addCardToInitialHand(new Card(0, 1))
    player2.addCardToInitialHand(new Card(0, 10))

    // TODO: assertion
  })

  it('test placeInsuranceBets()', () => {
    game1.addPlayer(player1)
    game1.placeBets()
    game1.dealRound()
    game1.placeInsuranceBets()
    // TODO: assertion
  })

  it('test resolveInsurance()', () => {
    game1.addPlayer(player1)
    game1.placeBets()
    game1.dealRound()
    game1.placeInsuranceBets()
    game1.resolveInsurance()
    // TODO: assertion
  })
})
