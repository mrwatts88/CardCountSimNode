"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
class Dealer {
    constructor() {
        this.currentHand = [];
        this.busted = false;
    }
    decideAction() {
        // TODO
        return game_1.Action.STAND;
    }
    calcHandTotal() {
        // TODO
        return 20;
    }
}
exports.default = Dealer;
