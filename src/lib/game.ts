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
    private bustedPlayers: Map<number, Player>
    private ruleSet: IRuleSet

    constructor(ruleSet: IRuleSet) {
        this.numPlayers = 0
        this.ruleSet = ruleSet
        this.roundIsOver = true
        this.activePlayers = new Map<number, Player>()
        this.bustedPlayers = new Map<number, Player>()
        this.dealer = new Dealer()
        this.shoe = new Shoe(NUMBER_OF_DECKS, CARDS_BEFORE_CUT, hiLoCountMap)
        this.shoe.init()
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
        this.activePlayers.forEach((p) => {
            p.placeBet(trueCount)
        })
    }

    public dealRound(): void {
        // TODO: Check that all active players have placed a bet
        this.activePlayers.forEach((p) => {
            p.addCardToHand(this.shoe.dealCard())
        })

        this.dealer.addCardToHand(this.shoe.dealCard())

        this.activePlayers.forEach((p) => {
            p.addCardToHand(this.shoe.dealCard())
        })

        this.dealer.addCardToHand(this.shoe.dealCard())
    }

    // TODO: Split into placeInsuranceBets() and resolveInsuranceBets()
    // placeInsuranceBets() will only be used in simulation, resolve will also be used in game-playing app
    public handleInsurance(): void {
        if (this.dealer.getCardAt(0).value !== 1) return

        this.activePlayers.forEach((p) => {
            if (p.usingIll18() && this.shoe.calcTrueCount() >= Ill18Indices.insurance)
                switch (this.dealer.getCardAt(1).value) {
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                        p.bankroll += p.currentBet
                        break
                    default:
                        p.bankroll -= (p.currentBet / 2)
                        break
                }
        })
    }

    // Only used in simulation
    // TODO: What to do about moving players to bustedPlayers if not using simulation???
    public playersPlayRound(): void {
        this.activePlayers.forEach((p) => {
            if (p.hasBlackjack()) {
                p.resolveBet(BLACKJACK_MULTIPLIER)
                p.bustedOrDiscarded = true
            } else {
                let takeAction = true
                while (takeAction) {
                    const action: number =
                        p.decideAction(this.shoe.calcTrueCount(), this.dealer.getCardAt(0).value)
                    let newCard: Card
                    switch (action) {
                        case Participant.actions.DOUBLE:
                            p.addCardToHand(this.shoe.dealCard())
                            p.bankroll -= p.currentBet
                            p.currentBet *= 2
                            takeAction = false
                            break
                        case Participant.actions.HIT:
                            newCard = this.shoe.dealCard()
                            p.addCardToHand(newCard)
                            if (p.calcHandTotal() > 21) {
                                p.bustedOrDiscarded = true
                                takeAction = false
                                break
                            }
                            break
                        case Participant.actions.SPLIT:
                            // TODO
                            console.log("splitting")
                            break
                        case Participant.actions.STAND:
                            takeAction = false
                            break
                    }
                }
            }
        })

        // Move busted players to bustedPlayers
        this.activePlayers.forEach((p, k) => {
            if (p.bustedOrDiscarded) {
                this.bustedPlayers.set(k, p)
                this.activePlayers.delete(k)
            }
        })
    }

    public dealerPlayRound(): void {
        if (this.activePlayers.size <= 0) return
        let takeAction = true
        while (takeAction) {
            const action: number = this.dealer.decideAction(this.ruleSet.h17)
            let newCard: Card
            switch (action) {
                case Participant.actions.HIT:
                    newCard = this.shoe.dealCard()
                    this.dealer.addCardToHand(newCard)
                    if (this.dealer.calcHandTotal() > 21) {
                        this.dealer.bustedOrDiscarded = true
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
        this.activePlayers.forEach((p) => {
            if (this.dealer.bustedOrDiscarded)
                p.resolveBet(1)
            else {
                const diff = p.calcHandTotal() - this.dealer.calcHandTotal()
                if (diff > 0)
                    p.resolveBet(1)
                else if (diff < 0)
                    p.resolveBet(0)
                else
                    p.resolveBet(0.5)
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
        // TODO
        this.bustedPlayers.forEach((p, k) => {
            this.activePlayers.set(k, p)
            this.bustedPlayers.delete(k)
        })

        this.activePlayers.forEach((p) => {
            // p
        })
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
