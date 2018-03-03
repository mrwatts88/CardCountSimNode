import { expect } from "chai"
import * as _ from "lodash"
import "mocha"
import Card from "../lib/card"
import Deck from "../lib/deck"

describe("Test Deck", () => {
    let deck

    beforeEach(() => {
        deck = new Deck()
        deck.init()
    })

    it("should initilize", () => {
        expect(deck.isEmpty()).to.equal(false)
    })

    it("should deal a Card object", () => {
        const card = deck.dealCard()
        expect(card).to.be.instanceof(Card)
        expect(_.isEqual(card, new Card(0, 1))).to.equal(true)
    })

    it("should deal 52 cards", () => {
        let i = 0
        while (!deck.isEmpty()) {
            deck.dealCard()
            ++i
        }

        expect(i).to.equal(52)
        expect(deck.isEmpty()).to.equal(true)
    })

    it("shuffle should shuffle the cards", () => {
        // TODO
    })
})
