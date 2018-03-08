import { expect } from "chai"
import "mocha"
import Card from "../lib/card"
import Dealer from "../lib/dealer"

describe("Test Dealer", () => {
    let card1, card2, card3, card4, card5,
        card6, card7, card8, card9, card10,
        card11, card12, card13, card14
    let dealer1, dealer2, dealer3, dealer4, dealer5

    before(() => {
        // TODO: make sure card isn't already in another hand

        // All possible cards
        card1 = new Card(0, 1 + Math.floor(Math.random() * 13))
        card2 = new Card(0, 1 + Math.floor(Math.random() * 13))

        // One ace at most
        card3 = new Card(0, 2 + Math.floor(Math.random() * 12))
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

        // Dealer 5
        card13 = new Card(0, 1)
        card14 = new Card(0, 10 + Math.floor(Math.random() * 4))

        dealer1 = new Dealer()
        dealer1.addCardToInitialHand(card1)
        dealer1.addCardToInitialHand(card2)

        dealer2 = new Dealer()
        dealer2.addCardToInitialHand(card3)
        dealer2.addCardToInitialHand(card4)

        dealer3 = new Dealer()
        dealer3.addCardToInitialHand(card5)
        dealer3.addCardToInitialHand(card6)
        dealer3.addCardToInitialHand(card7)
        dealer3.addCardToInitialHand(card8)

        dealer4 = new Dealer()
        dealer4.addCardToInitialHand(card9)
        dealer4.addCardToInitialHand(card10)
        dealer4.addCardToInitialHand(card11)
        dealer4.addCardToInitialHand(card12)

        dealer5 = new Dealer()
        dealer5.addCardToInitialHand(card13)
        dealer5.addCardToInitialHand(card14)
    })

    it("test addCardToInitialHand", () => {
        expect(dealer1.currentHand().getCardAt(0) === card1)
        expect(dealer1.currentHand().getCardAt(1) === card2)
    })

    it("test decideAction", () => {
        // TODO
    })

    it("test calcHandTotal (at most one Ace) (2 cards)", () => {
        expect(dealer2.calcHandTotal()).to.equal(card3.valAsInt() + card4.valAsInt())
    })

    it("test calcHandTotal (more than 2 cards, at least one Ace)", () => {
        expect(dealer3.calcHandTotal()).to.equal(19)
        expect(dealer4.calcHandTotal()).to.equal(14)
    })

    it("should have blackjack", () => {
        expect(dealer5.hasBlackjack()).to.equal(true)
    })
})
