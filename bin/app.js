"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./lib/game");
const player_1 = require("./lib/player");
class Main {
    constructor() {
        const game = new game_1.default();
        const player = new player_1.default([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], false);
        game.addPlayer(player);
        game.placeBets();
        game.dealRound();
        // TODO: move the following block into handleInsurance() or some other method of Game
        if (game.dealer.currentHand[0].value === 1) {
            game.handleInsurance();
            if (faceCardVals.indexOf(game.dealer.currentHand[1].value) !== -1) {
                for (const p of game.activePlayers)
                    if (p.hasBlackjack())
                        p.resolveBet(0.5);
                    else
                        p.resolveBet(0);
                game.roundIsOver = true;
            }
        }
        if (!game.roundIsOver) {
            // After this method returns, all the players have the correct current bet and a hand total.
            // All busted players or one"s already paid for a blackjack will be moved from the activePlayers
            // array to the bustedPlayers array.
            game.playersPlayRound();
            // After dealerPlayRound returns, the dealer will have a hand total and a busted status
            // TODO: Move condition inside method
            if (game.activePlayers.length > 0)
                game.dealerPlayRound();
            // TODO: Move the following block into a method in Game
            for (const p of game.activePlayers)
                if (game.dealer.busted)
                    p.resolveBet(1);
                else {
                    const diff = p.calcHandTotal() - game.dealer.calcHandTotal();
                    if (diff > 0)
                        p.resolveBet(1);
                    else if (diff < 0)
                        p.resolveBet(0);
                    else
                        p.resolveBet(0.5);
                }
        }
        // Everyone has placed bets, gotten cards, played their hands, and been paid.
        // Restore the status to the state before the hand.
        game.cleanUp();
    }
}
exports.Main = Main;
const faceCardVals = [10, 11, 12, 13];
