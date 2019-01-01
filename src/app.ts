import Game from './lib/game'
import Player from './lib/player'
import { SIX_DECK_H17_DAS_NO_SURR } from './lib/strategy'
import { DEBUG } from './utils'

const ramp = [0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
const flat = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]

const game = new Game({ h17: true })
const player = new Player(SIX_DECK_H17_DAS_NO_SURR, false, flat)

game.addPlayer(player)

console.log(game.getPlayerAt(1).getStats().edge)

for (let i: number = 0; i < 100000; ++i) {
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

  if (!(i % 500)) console.log(game.getPlayerAt(1).getStats())
  game.shuffleShoe()
}

console.log(game.getPlayerAt(1).getStats().edge)
