import Game from "./lib/game"
import Player from "./lib/player"
import { SIX_DECK_H17_DAS_NO_SURR } from "./lib/strategy"

export class Main {
    constructor() {
        const game = new Game({ h17: true })
        const player = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        game.addPlayer(player)
        game.placeBets()
        game.dealRound()
        game.placeInsuranceBets()
        game.resolveInsurance()

        if (!game.getDealer().hasBlackjack()) {
            // After this method returns, all the players have the correct current bet and a hand total.
            // All busted players or one"s already paid for a blackjack will be moved from the activePlayers
            // array to the bustedPlayers array.
            game.playersPlayRound()
            // After dealerPlayRound returns, the dealer will have a hand total and a busted status
            game.dealerPlayRound()
            game.resolveBets()
        }
        // Everyone has placed bets, gotten cards, played their hands, and been paid.
        // Restore the status to the state before the hand.
        game.cleanUp()
    }
}
