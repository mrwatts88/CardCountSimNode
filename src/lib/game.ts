import Card from "./card"
import Dealer from "./dealer"
import Participant from "./participant"
import Player from "./player"
import { IRuleSet } from "./rules"
import Shoe from "./shoe"

export default class Game {
    private activePlayers: Map<number, Player>
    private numPlayers: number
    private dealer: Dealer
    private shoe: Shoe
    private roundIsOver: boolean
    private ruleSet: IRuleSet

    constructor(ruleSet: IRuleSet) {
        this.numPlayers = 0
        this.ruleSet = ruleSet
        this.roundIsOver = true
        this.activePlayers = new Map<number, Player>()
        this.dealer = new Dealer()
        this.shoe = new Shoe(NUMBER_OF_DECKS, CARDS_BEFORE_CUT, hiLoCountMap)
        this.shoe.shuffle()
    }

    public shuffleShoe(): void {
        this.shoe.shuffle()
    }

    public addPlayer(player: Player): void {
        if (!this.roundIsOver)
            throw new Error("Cannot add player during round.")
        ++this.numPlayers
        this.activePlayers.set(this.numPlayers, player)
    }

    // This is used only during card counting simulation, not for creating a blackjack playing app
    public placeBets(): void {
        this.roundIsOver = false
        const trueCount = this.shoe.calcTrueCount()
        this.activePlayers.forEach(p => p.placeBet(trueCount))
    }

    public dealRound(): void {
        // TODO: Check that all active players have placed a bet
        this.activePlayers.forEach(p => {
            p.addCardToInitialHand(this.shoe.dealCard())
        })
        this.dealer.addCardToInitialHand(this.shoe.dealCard())
        this.activePlayers.forEach(p => {
            p.addCardToInitialHand(this.shoe.dealCard())
        })
        this.dealer.addCardToInitialHand(this.shoe.dealCard())
    }

    // placeInsuranceBets() will only be used in simulation, resolve will also be used in game-playing app
    public placeInsuranceBets(): void {
        if (this.dealer.currentHand().getCardAt(0).value !== 1) return
        this.activePlayers.forEach(p => {
            if (p.usingIll18() && this.shoe.calcTrueCount() >= Ill18Indices.insurance)
                p.currentInsuranceBet = 0.5 * p.currentBet
        })
    }

    public resolveInsurance(): void {
        if (this.dealer.currentHand().getCardAt(0).value !== 1) return
        this.activePlayers.forEach(p => {
            if (this.dealer.currentHand().getCardAt(1).valAsInt() === 10)
                p.bankroll += p.currentInsuranceBet
            p.currentInsuranceBet = 0
        })
    }

    // Only used in simulation
    public playersPlayRound(): void {
        this.activePlayers.forEach(p => {
            for (let i = 0; i < p.hands.length; ++i) {
                if (p.hands[i].bustedOrDiscarded)
                    continue
                p.currentHandIndex = i
                if (i == 0 && p.hands[i].hasBlackjack()) {
                    p.resolveBet(BLACKJACK_MULTIPLIER, p.hands[i].bet)
                    p.hands[i].bustedOrDiscarded = true
                } else {
                    let takeAction = true
                    while (takeAction) {
                        const action: number =
                            p.decideAction(this.shoe.calcTrueCount(),
                                this.dealer.currentHand().getCardAt(0).valAsInt())
                        let newCard: Card
                        switch (action) {
                            case Participant.actions.DOUBLE:
                                p.addCardToInitialHand(this.shoe.dealCard())
                                p.bankroll -= p.currentBet
                                p.currentBet *= 2
                                takeAction = false
                                break
                            case Participant.actions.HIT:
                                newCard = this.shoe.dealCard()
                                p.addCardToInitialHand(newCard)
                                if (p.hands[i].calcHandTotal() > 21) {
                                    p.hands[i].bustedOrDiscarded = true
                                    takeAction = false
                                    break
                                }
                                break
                            case Participant.actions.SPLIT:
                                // TODO
                                console.log("splitting")
                                takeAction = false
                                break
                            case Participant.actions.STAND:
                                takeAction = false
                                break
                        }
                    }
                }
            }
        })
    }

    public playersLeft(): boolean {
        let players = false;
        this.activePlayers.forEach(p => {
            for (let i = 0; i < p.hands.length; ++i)
                if (!p.hands[i].bustedOrDiscarded) {
                    players = true;
                    break;
                }
        })
        return players
    }

    public dealerPlayRound(): void {
        if (!this.playersLeft()) return
        let takeAction = true
        while (takeAction) {
            const action: number = this.dealer.decideAction(this.ruleSet.h17)
            let newCard: Card
            switch (action) {
                case Participant.actions.HIT:
                    newCard = this.shoe.dealCard()
                    this.dealer.currentHand().addCardToHand(newCard)
                    if (this.dealer.currentHand().calcHandTotal() > 21) {
                        this.dealer.currentHand().bustedOrDiscarded = true
                        takeAction = false
                        break
                    }
                    break
                case Participant.actions.STAND:
                    takeAction = false
                    break
            }
        }
    }

    public resolveBets(): void {
        this.activePlayers.forEach(p => {
            for (let i = 0; i < p.hands.length; ++i) {
                if (p.hands[i].bustedOrDiscarded)
                    continue
                if (this.dealer.currentHand().bustedOrDiscarded)
                    p.resolveBet(1, p.hands[i].bet)
                else {
                    const diff = p.hands[i].calcHandTotal() - this.dealer.currentHand().calcHandTotal()
                    if (diff > 0)
                        p.resolveBet(1, p.hands[i].bet)
                    else if (diff < 0)
                        p.resolveBet(0, p.hands[i].bet)
                    else
                        p.resolveBet(0.5, p.hands[i].bet)
                }
            }
        })
    }

    public getNumPlayers(): number {
        return this.numPlayers
    }

    public getPlayerAt(i: number): Player {
        if (i < 1)
            throw new Error("Invalid index for player")
        if (this.activePlayers.size < i)
            throw new Error("No player here")
        return this.activePlayers.get(i)
    }

    public getDealer(): Dealer {
        return this.dealer
    }

    public cleanUp(): void {
        this.activePlayers.forEach(p => {
            for (let i = 0; i < p.hands.length; ++i) {
                p.hands[i].clearHand()
                p.hands[i].bet = 0
                p.currentBet = 0
            }
        })

        this.dealer.currentHand().clearHand()
        this.roundIsOver = true
    }
}

// Constants, enums, etc
const BLACKJACK_MULTIPLIER = 1.5
const NUMBER_OF_DECKS = 6
const CARDS_BEFORE_CUT = 260

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

const Ill18Indices = {
    insurance: 3,
}
