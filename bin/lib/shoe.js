"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deck_1 = require("./deck");
class Shoe extends deck_1.default {
    constructor(numDecks, cardsBeforeCut, countValueMapping) {
        super();
        this.numDecks = numDecks;
        this.cardsBeforeCut = cardsBeforeCut;
        this.runningCount = 0;
        this.countValueMapping = countValueMapping;
    }
    dealCard() {
        const card = super.dealCard();
        this.runningCount += this.countValueMapping[card.value];
        return card;
    }
    calcTrueCount() {
        // Based on closest number of 1/4 decks left in the undealt shoe.
        // Result if truncated because a true count must be reached before betting...
        // according to that count. (e.g. TC = 1.99 = 1)
        return this.runningCount / Math.round(this.cardsNotDealt.length / 13);
    }
    setCountMap(countMap) {
        this.countValueMapping = countMap;
    }
    hasReachedCut() {
        return this.cardsDealt.length >= this.cardsBeforeCut;
    }
    init() {
        super.init();
        for (let i = 1; i < this.numDecks; ++i)
            this.addDeck(new deck_1.default());
    }
    addDeck(deck) {
        deck.init();
        while (!deck.isEmpty())
            this.cardsNotDealt.push(deck.dealCard());
    }
}
exports.default = Shoe;
