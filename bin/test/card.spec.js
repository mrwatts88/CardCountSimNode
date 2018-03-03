"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const card_1 = require("../lib/card");
describe("Test Card", () => {
    let card;
    const suit = card_1.default.Suits.C; // TODO: make this random or run a bunch of them.
    const val = 1; // TODO: this too
    const stringVal = "AC";
    before(() => {
        card = new card_1.default(suit, val);
    });
    it("should construct with suit and value", () => {
        chai_1.expect(card.suit).to.equal(suit);
        chai_1.expect(card.value).to.equal(val);
    });
    it("should display val as string", () => {
        chai_1.expect(card.toString()).to.equal(stringVal);
    });
    it("should convert numeric value to string", () => {
        const stringVals = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
        for (let i = 1; i <= 13; ++i)
            chai_1.expect(card.intValToStringVal(i)).to.equal(stringVals[i - 1]);
        chai_1.expect(() => { card.intValToStringVal(14); }).to.throw("Not a valid card value");
    });
});
