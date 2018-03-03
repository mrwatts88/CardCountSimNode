import { expect } from "chai"
import "mocha"
import Card from "./card"
import Game from "./game"
import Player from "./player"

describe("Test Card", () => {
    let card
    const suit = Card.Suits.C // TODO: make this random or run a bunch of them.
    const val = 1 // TODO: this too
    const stringVal = "AC"

    before(() => {
        card = new Card(suit, val)
    })

    it("should construct with suit and value", () => {
        expect(card.suit).to.equal(suit)
        expect(card.value).to.equal(val)
    })

    it("should display val as string", () => {
        expect(card.toString()).to.equal(stringVal)
    })

    it("should convert numeric value to string", () => {
        const stringVals = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"]
        for (let i = 1; i <= 13; ++i)
            expect(card.intValToStringVal(i)).to.equal(stringVals[i - 1])
        expect(() => { card.intValToStringVal(14) }).to.throw("Not a valid card value")
    })
})
