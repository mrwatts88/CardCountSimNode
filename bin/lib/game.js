"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dealer_1 = require("./dealer");
const shoe_1 = require("./shoe");
class Game {
    constructor() {
        this.roundIsOver = false;
        this.activePlayers = [];
        this.dealer = new dealer_1.default();
        this.shoe = new shoe_1.default(NUMBER_OF_DECKS, CARDS_BEFORE_CUT, hiLoCountMap);
    }
    addPlayer(player) {
        // if (!this.roundIsOver)
        //     throw "Cannot add player during round."; // TODO: Check on this syntax
        this.activePlayers.push(player);
    }
    placeBets() {
        for (const player of this.activePlayers)
            player.placeBet(this.shoe.calcTrueCount());
    }
    dealRound() {
        for (const player of this.activePlayers)
            player.currentHand.push(this.shoe.dealCard());
        this.dealer.currentHand.push(this.shoe.dealCard());
        for (const player of this.activePlayers)
            player.currentHand.push(this.shoe.dealCard());
        this.dealer.currentHand.push(this.shoe.dealCard());
    }
    handleInsurance() {
        if (this.dealer.currentHand[0].value !== 1)
            return;
        for (const player of this.activePlayers)
            if (player.usingIll18() && this.shoe.calcTrueCount() >= Ill18Indices.insurance)
                switch (this.dealer.currentHand[1].value) {
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                        player.bankroll += player.currentBet;
                        break;
                    default:
                        player.bankroll -= (player.currentBet / 2);
                        break;
                }
    }
    playersPlayRound() {
        for (const player of this.activePlayers) {
            if (player.hasBlackjack()) {
                player.resolveBet(BLACKJACK_MULTIPLIER);
                player.discarded = true;
            }
            else {
                let takeAction = true;
                while (takeAction) {
                    const action = player.decideAction(this.shoe.calcTrueCount(), this.dealer.currentHand[0].value);
                    let newCard;
                    switch (action) {
                        case Action.DOUBLE:
                            player.currentHand.push(this.shoe.dealCard());
                            player.bankroll -= player.currentBet;
                            player.currentBet *= 2;
                            takeAction = false;
                            break;
                        case Action.HIT:
                            newCard = this.shoe.dealCard();
                            player.currentHand.push(newCard);
                            if (player.calcHandTotal() > 21) {
                                player.discarded = true;
                                takeAction = false;
                                break;
                            }
                            break;
                        case Action.SPLIT:
                            // TODO
                            break;
                        case Action.STAND:
                            takeAction = false;
                            break;
                    }
                }
            }
            for (let i = this.activePlayers.length - 1; i >= 0; ++i)
                if (this.activePlayers[i].discarded)
                    this.bustedPlayers.push(this.activePlayers.splice(i, 1)[0]);
        }
    }
    dealerPlayRound() {
        let takeAction = true;
        while (takeAction) {
            const action = this.dealer.decideAction();
            let newCard;
            switch (action) {
                case Action.HIT:
                    newCard = this.shoe.dealCard();
                    this.dealer.currentHand.push(newCard);
                    if (this.dealer.calcHandTotal() > 21) {
                        this.dealer.busted = true;
                        takeAction = false;
                        break;
                    }
                    break;
                case Action.STAND:
                    takeAction = false;
                    break;
            }
        }
    }
    cleanUp() {
        // TODO
    }
}
exports.default = Game;
var Action;
(function (Action) {
    Action[Action["STAND"] = 0] = "STAND";
    Action[Action["HIT"] = 1] = "HIT";
    Action[Action["DOUBLE"] = 2] = "DOUBLE";
    Action[Action["SPLIT"] = 3] = "SPLIT";
})(Action = exports.Action || (exports.Action = {}));
// Constants, enums, etc
const BLACKJACK_MULTIPLIER = 1.5;
const NUMBER_OF_DECKS = 6;
const CARDS_BEFORE_CUT = 260;
const hiLoCountMap = {
    1: -1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 0,
    8: 0,
    9: 0,
    10: -1,
    11: -1,
    12: -1,
    13: -1,
};
const Ill18Indices = {
    insurance: 3,
};
