import { expect } from "chai"
import "mocha"
import Card from "../lib/card"
import Dealer from "../lib/dealer"

describe("Test Dealer", () => {
    let card1, card2, card3, card4, card5,
        card6, card7, card8, card9, card10, card11, card12
    let dealer1, dealer2, dealer3, dealer4

    before(() => {

        // All possible cards
        card1 = new Card(0, 1 + Math.floor(Math.random() * 13))
        card2 = new Card(0, 1 + Math.floor(Math.random() * 13))

        // All possible cards
        card3 = new Card(0, 1 + Math.floor(Math.random() * 13))
        card4 = new Card(0, 1 + Math.floor(Math.random() * 13))

        // Dealer 3
        card5 = new Card(0, 1)
        card6 = new Card(0, 12)
        card7 = new Card(0, 3)
        card8 = new Card(0, 5)

        // Dealer 4
        card9 = new Card(0, 1)
        card10 = new Card(0, 1)
        card11 = new Card(0, 1)
        card12 = new Card(0, 1)

        dealer1 = new Dealer()
        dealer1.addCardToHand(card1)
        dealer1.addCardToHand(card2)

        dealer2 = new Dealer()
        dealer2.addCardToHand(card3)
        dealer2.addCardToHand(card4)

        dealer3 = new Dealer()
        dealer3.addCardToHand(card5)
        dealer3.addCardToHand(card6)
        dealer3.addCardToHand(card7)
        dealer3.addCardToHand(card8)

        dealer4 = new Dealer()
        dealer4.addCardToHand(card9)
        dealer4.addCardToHand(card10)
        dealer4.addCardToHand(card11)
        dealer4.addCardToHand(card12)
    })

    it("test addCardToHand", () => {
        expect(dealer1.getCardAt(0) === card1)
        expect(dealer1.getCardAt(1) === card2)
    })

    it("test decideAction", () => {
        // TODO
    })

    it("test calcHandTotal (2 cards)", () => {
        expect(dealer2.calcHandTotal()).to.equal(card3.valAsInt() + card4.valAsInt())
    })

    it("test calcHandTotal (more than 2 cards, at least one Ace)", () => {
        expect(dealer3.calcHandTotal()).to.equal(19)
        expect(dealer4.calcHandTotal()).to.equal(14)
    })
})
