"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("./card");
class Deck {
    constructor() {
        this.cardsNotDealt = [];
        this.cardsDealt = [];
    }
    shuffle() {
        this.init();
        for (const i of this.cardsNotDealt) {
            const c1 = Math.floor(Math.random() * this.cardsNotDealt.length);
            const c2 = Math.floor(Math.random() * this.cardsNotDealt.length);
            const temp = this.cardsNotDealt[c1];
            this.cardsNotDealt[c1] = this.cardsNotDealt[c2];
            this.cardsNotDealt[c2] = temp;
        }
    }
    print() {
        for (const card of this.cardsNotDealt)
            console.info(card.toString());
    }
    dealCard() {
        const card = this.cardsNotDealt.shift();
        this.cardsDealt.push(card);
        return card;
    }
    isEmpty() {
        return this.cardsNotDealt.length === 0;
    }
    init() {
        this.cardsNotDealt = [];
        this.cardsDealt = [];
        for (let suit = 0; suit < 4; ++suit)
            for (let value = 0; value < 13; ++value)
                this.cardsNotDealt[13 * suit + value] = new card_1.default(suit, value + 1);
    }
}
exports.default = Deck;
