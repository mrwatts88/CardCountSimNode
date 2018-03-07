import { expect } from "chai"
import "mocha"
import Card from "../lib/card"
import Participant from "../lib/participant"
import Player from "../lib/player"
import { SIX_DECK_H17_DAS_NO_SURR } from "../lib/strategy"

const { actions: { HIT, STAND, SPLIT, DOUBLE, DS } } = Participant

describe("Test Player", () => {
    let card1, card2, card3, card4, card5,
        card6, card7, card8, card9, card10, card11, card12
    let player1, player2, player3, player4, player5

    before(() => {

        // All possible cards
        card1 = new Card(0, 1 + Math.floor(Math.random() * 13))
        card2 = new Card(0, 1 + Math.floor(Math.random() * 13))

        // At most one ace
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

        player1 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        player1.addCardToHand(card1)
        player1.addCardToHand(card2)

        player2 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        player2.addCardToHand(card3)
        player2.addCardToHand(card4)

        player3 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        player3.addCardToHand(card5)
        player3.addCardToHand(card6)
        player3.addCardToHand(card7)
        player3.addCardToHand(card8)

        player4 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        player4.addCardToHand(card9)
        player4.addCardToHand(card10)
        player4.addCardToHand(card11)
        player4.addCardToHand(card12)

        player5 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    })

    it("test addCardToHand", () => {
        expect(player1.getCardAt(0)).to.equal(card1)
        expect(player1.getCardAt(1)).to.equal(card2)
    })

    it("test decideAction", () => {
        // TODO
    })

    it("test calcHandTotal (2 cards, at most one ace)", () => {
        expect(player2.calcHandTotal()).to.equal(card3.valAsInt() + card4.valAsInt())
    })

    it("test calcHandTotal (more than 2 cards, at least one Ace)", () => {
        expect(player3.calcHandTotal()).to.equal(19)
        expect(player4.calcHandTotal()).to.equal(14)
    })

    it("test placeBet", () => {
        // TODO
        player5.placeBet(5)
    })

    it("test resolveBet()", () => {
        // TODO
        player5.resolveBet(1)
    })

    it("should split 3s against 7 or less", () => {
        player5.addCardToHand(new Card(0, 3))
        player5.addCardToHand(new Card(3, 3))
        expect(player5.decideAction(2, 2)).to.equal(SPLIT)
        expect(player5.decideAction(2, 3)).to.equal(SPLIT)
        expect(player5.decideAction(2, 4)).to.equal(SPLIT)
        expect(player5.decideAction(2, 5)).to.equal(SPLIT)
        expect(player5.decideAction(2, 6)).to.equal(SPLIT)
        expect(player5.decideAction(2, 7)).to.equal(SPLIT)
        expect(player5.decideAction(2, 8)).to.equal(HIT)
        expect(player5.decideAction(2, 9)).to.equal(HIT)
        expect(player5.decideAction(2, 10)).to.equal(HIT)
        expect(player5.decideAction(2, 11)).to.equal(HIT)
    })

    // TODO: More methods to test
})
