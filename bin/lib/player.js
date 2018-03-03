"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
class Player {
    constructor(bettingRamp, ill18) {
        this.discarded = false;
        this.ill18 = ill18;
        this.bettingRamp = new Map();
        for (let i = 1; i < 11; ++i)
            this.bettingRamp.set(i, bettingRamp[i - 1]);
        this.currentBet = 0;
        this.currentHand = [];
        this.bankroll = 0;
    }
    usingIll18() {
        return this.ill18;
    }
    placeBet(count) {
        this.currentBet = this.bettingRamp.get(count);
        if (this.currentBet === undefined)
            this.currentBet = 1;
        this.bankroll -= this.currentBet;
    }
    resolveBet(multiplier) {
        // 0 = loss, 0.5 = push, 1 = even money win, 1.2 = 6 to 5, 1.5 = 3 to 2
        this.bankroll += multiplier === 0 ? 0 : (this.currentBet * (multiplier + 1));
    }
    decideAction(count, dealerUpcardVal) {
        // TODO: implement basic strategy here, take into account ill18
        return game_1.Action.HIT;
    }
    calcHandTotal() {
        // TODO
        return 21;
    }
    hasBlackjack() {
        return false;
    }
}
exports.default = Player;
