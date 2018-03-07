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

    before(() => {
        game1 = new Game({ h17: true })
        player1 = new Player(SIX_DECK_H17_DAS_NO_SURR, false, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
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
        expect(game1.getPlayerAt(1)).to.equal(player1)
        expect(game1.getNumPlayers()).to.equal(1)
    })

    it("should place bets", () => {
        game1.placeBets()
        expect(game1.getPlayerAt(1).currentBet).to.equal(1)
    })

    it("test dealRound", () => {
        game1.dealRound()
    })

    it("test placeInsuranceBets()", () => {
        game1.placeInsuranceBets()
    })

    it("test resolveInsurance()", () => {
        game1.resolveInsurance()
    })

    it("test playersPlayRound", () => {
        game1.playersPlayRound()
    })

    it("test dealerPlayRound", () => {
        game1.dealerPlayRound()
    })

    it("test resolveBets", () => {
        game1.resolveBets()
    })

    it("test cleanUp", () => {
        game1.cleanUp()
    })

})
