"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _ = require("lodash");
require("mocha");
const card_1 = require("../lib/card");
const deck_1 = require("../lib/deck");
describe("Test Deck", () => {
    let deck;
    beforeEach(() => {
        deck = new deck_1.default();
        deck.init();
    });
    it("should initilize", () => {
        chai_1.expect(deck.isEmpty()).to.equal(false);
    });
    it("should deal a Card object", () => {
        const card = deck.dealCard();
        chai_1.expect(card).to.be.instanceof(card_1.default);
        chai_1.expect(_.isEqual(card, new card_1.default(0, 1))).to.equal(true);
    });
    it("should deal 52 cards", () => {
        let i = 0;
        while (!deck.isEmpty()) {
            deck.dealCard();
            ++i;
        }
        chai_1.expect(i).to.equal(52);
        chai_1.expect(deck.isEmpty()).to.equal(true);
    });
    it("shuffle should shuffle the cards", () => {
        // TODO
    });
});
