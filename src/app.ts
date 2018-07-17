import Game from './lib/game'
import Player from './lib/player'
import { SIX_DECK_H17_DAS_NO_SURR } from './lib/strategy'

export class Main {
  constructor() {
    const game = new Game({ h17: true })
    const player = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [
      1,
      2,
      4,
      4,
      8,
      8,
      8,
      8,
      10,
      10,
    ])

    game.addPlayer(player)

    while (!game.hasReachedCutCard()) {
      console.info('Placing bets...')
      game.placeBets()
      console.info('Dealing round...')
      game.dealRound()
      console.info('Placing insurance...')
      game.placeInsuranceBets()
      console.info('Resolving insurance...')
      game.resolveInsurance()

      if (!game.getDealer().hasBlackjack()) {
        // After this method returns, all the players have the correct current bet and a hand total.
        // All busted players or ones already paid for a blackjack will be moved from the activePlayers
        // array to the bustedPlayers array.
        console.info('Players playing round...')
        game.playersPlayRound()
        // After dealerPlayRound returns, the dealer will have a hand total and a busted status
        console.info('Dealer playing round...')
        game.dealerPlayRound()
        console.info('Resolving bets...')
        game.resolveBets()
      } else game.getActivePlayers().forEach(p => p.resolveBet(-1, 0))

      // Everyone has placed bets, gotten cards, played their hands, and been paid.
      // Restore the status to the state before the hand.
      console.info('Cleaning up round...')
      game.cleanUp()
      console.info('\n\n')
    }
  }
}

new Main()
