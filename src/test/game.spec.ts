import { expect } from "chai"
import "mocha"
import Card from "../lib/card"
import Dealer from "../lib/dealer"
import Game from "../lib/game"
import Player from "../lib/player"
import Shoe from "../lib/shoe"
import { SIX_DECK_H17_DAS_NO_SURR } from "../lib/strategy"

describe("Test Game", () => {
    let game1
    let player1
    let game2
    let player2

    before(() => {
        game1 = new Game({ h17: true })
        player1 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        game2 = new Game({ h17: true })
        player2 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    })

    it("should have a dealer", () => {
        expect(game1.getDealer()).to.not.equal(undefined)
    })

    it("test shuffleShoe", () => {
        game1.shuffleShoe()
    })

    it("should add Player", () => {
        // TODO: Make sure player isn't in another game
        game1.addPlayer(player1)
        game2.addPlayer(player2)
        expect(game1.getPlayerAt(1)).to.equal(player1)
        expect(game1.getNumPlayers()).to.equal(1)
    })

    it("should place bets", () => {
        game1.placeBets()
        game2.placeBets()
        expect(game1.getPlayerAt(1).currentBet).to.equal(1)
    })

    it("test dealRound", () => {
        game1.dealRound()
        game2.dealRound()
    })

    it("give player and dealer blackjack", () => {
        game2.dealer.clearHand()
        game2.dealer.addCardToHand(new Card(0, 1))
        game2.dealer.addCardToHand(new Card(0, 10))

        player2.currentHand().clearHand()
        player2.addCardToInitialHand(new Card(0, 1))
        player2.addCardToInitialHand(new Card(0, 10))
    })

    it("test placeInsuranceBets()", () => {
        game1.placeInsuranceBets()
        game2.placeInsuranceBets()
    })

    it("test resolveInsurance()", () => {
        game1.resolveInsurance()
        game2.resolveInsurance()
    })

    it("test playersPlayRound", () => {
        if (!game1.dealer.hasBlackjack())
            game1.playersPlayRound()
        if (!game2.dealer.hasBlackjack())
            game2.playersPlayRound()
    })

    it("test dealerPlayRound", () => {
        if (!game1.dealer.hasBlackjack())
            game1.dealerPlayRound()
        if (!game2.dealer.hasBlackjack())
            game2.dealerPlayRound()
    })

    it("test resolveBets", () => {
        game1.resolveBets()
        game2.resolveBets()

    })

    it("test cleanUp", () => {
        game1.cleanUp()
        game2.cleanUp()
    })
})
