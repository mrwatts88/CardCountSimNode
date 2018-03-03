import { expect } from "chai"
import * as _ from "lodash"
import "mocha"
import Card from "../lib/card"
import Shoe from "../lib/shoe"

describe("Test Shoe", () => {
    let shoe

    beforeEach(() => {
        shoe = new Shoe(6, 52, hiLoCountMap)
        shoe.init()
    })

    it("should initilize", () => {
        expect(shoe.isEmpty()).to.equal(false)
    })

    it("should deal a Card object", () => {
        const card = shoe.dealCard()
        expect(card).to.be.instanceof(Card)
        expect(_.isEqual(card, new Card(0, 1))).to.equal(true)
    })

    it("should deal 312 cards", () => {
        let i = 0
        while (!shoe.isEmpty()) {
            shoe.dealCard()
            ++i
        }

        shoe.print()
        expect(i).to.equal(312)
        expect(shoe.isEmpty()).to.equal(true)
    })

    it("shuffle should shuffle the cards", () => {
        // TODO
    })
})

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
}
