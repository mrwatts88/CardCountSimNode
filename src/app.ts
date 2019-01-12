import { Game } from './lib/game'
import { Player } from './lib/player'
import { SIX_DECK_H17_DAS_NO_SURR } from './lib/strategy'
import { DEBUG } from './lib/utils'

const ramp = [5, 25, 40, 60, 60, 60, 60, 60, 60, 60, 60]
const ramp2 = [0, 25, 40, 60, 60, 60, 60, 60, 60, 60, 60]
const ramp3 = [0, 25, 40, 60, 60, 60, 60, 60, 60, 60, 60]
const flat = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]

const game = new Game({ h17: true })
const player = new Player(SIX_DECK_H17_DAS_NO_SURR, false, ramp)
const player2 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, ramp2)
const player3 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, ramp3)
const player4 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, ramp)
const player5 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, ramp)
const player6 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, ramp)

game.addPlayer(player)
game.addPlayer(player2)
game.addPlayer(player3)
// game.addPlayer(player4)
// game.addPlayer(player5)
// game.addPlayer(player6)

console.log(game.getPlayerAt(1).getStats().edge)

for (let i: number = 0; i < 15600; ++i) {
  while (!game.hasReachedCutCard()) {
    DEBUG('Placing bets...')
    game.placeBets()
    DEBUG('Dealing round...')
    game.dealRound()
    DEBUG('Placing insurance...')
    game.placeInsuranceBets()
    DEBUG('Resolving insurance...')
    game.resolveInsurance()

    if (!game.getDealer().hasBlackjack()) {
      // After this method returns, all the players have the correct current bet and a hand total.
      // All busted players or ones already paid for a blackjack will be moved from the activePlayers
      // array to the bustedPlayers array.
      DEBUG('Players playing round...')
      game.playersPlayRound()

      // After dealerPlayRound returns, the dealer will have a hand total and a busted status
      DEBUG('Dealer playing round...')
      game.dealerPlayRound()
    }

    DEBUG('Resolving bets...')
    game.resolveBets()

    // Everyone has placed bets, gotten cards, played their hands, and been paid.
    // Restore the status to the state before the hand.
    DEBUG('Cleaning up round...')
    game.cleanUp()
    DEBUG('' + game.getPlayerAt(1).getStats().profit)
    DEBUG('\n\n')
  }

  if (!(i % 300)) console.log(Math.floor(
  (
    game.getPlayerAt(1).bankroll+
    game.getPlayerAt(2).bankroll+
    game.getPlayerAt(3).bankroll
  )/3))

  game.shuffleShoe()
}

console.log(game.getPlayerAt(1).getStats().edge)
