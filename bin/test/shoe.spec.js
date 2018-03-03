"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _ = require("lodash");
require("mocha");
const card_1 = require("../lib/card");
const shoe_1 = require("../lib/shoe");
describe("Test Shoe", () => {
    let shoe;
    beforeEach(() => {
        shoe = new shoe_1.default(6, 52, hiLoCountMap);
        shoe.init();
    });
    it("should initilize", () => {
        chai_1.expect(shoe.isEmpty()).to.equal(false);
    });
    it("should deal a Card object", () => {
        const card = shoe.dealCard();
        chai_1.expect(card).to.be.instanceof(card_1.default);
        chai_1.expect(_.isEqual(card, new card_1.default(0, 1))).to.equal(true);
    });
    it("should deal 312 cards", () => {
        let i = 0;
        while (!shoe.isEmpty()) {
            shoe.dealCard();
            ++i;
        }
        shoe.print();
        chai_1.expect(i).to.equal(312);
        chai_1.expect(shoe.isEmpty()).to.equal(true);
    });
    it("shuffle should shuffle the cards", () => {
        // TODO
    });
});
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
