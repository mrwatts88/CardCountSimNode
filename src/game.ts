import Card from "./card"
import Dealer from "./dealer"
import Player from "./player"
import Shoe from "./shoe"

export default class Game {
    public activePlayers: Player[]
    public dealer: Dealer
    public shoe: Shoe
    public roundIsOver: boolean
    private bustedPlayers: Player[]

    constructor() {
        this.roundIsOver = false
        this.activePlayers = []
        this.dealer = new Dealer()
        this.shoe = new Shoe(NUMBER_OF_DECKS, CARDS_BEFORE_CUT, hiLoCountMap)
    }

    public addPlayer(player: Player): void {
        // if (!this.roundIsOver)
        //     throw "Cannot add player during round."; // TODO: Check on this syntax

        this.activePlayers.push(player)
    }

    public placeBets(): void {
        for (const player of this.activePlayers)
            player.placeBet(this.shoe.calcTrueCount())
    }

    public dealRound(): void {
        for (const player of this.activePlayers)
            player.currentHand.push(this.shoe.dealCard())

        this.dealer.currentHand.push(this.shoe.dealCard())

        for (const player of this.activePlayers)
            player.currentHand.push(this.shoe.dealCard())

        this.dealer.currentHand.push(this.shoe.dealCard())
    }

    public handleInsurance(): void {
        if (this.dealer.currentHand[0].value !== 1) return
        for (const player of this.activePlayers)
            if (player.usingIll18() && this.shoe.calcTrueCount() >= Ill18Indices.insurance)
                switch (this.dealer.currentHand[1].value) {
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                        player.bankroll += player.currentBet
                        break
                    default:
                        player.bankroll -= (player.currentBet / 2)
                        break
                }
    }

    public playersPlayRound(): void {
        for (const player of this.activePlayers) {
            if (player.hasBlackjack()) {
                player.resolveBet(BLACKJACK_MULTIPLIER)
                player.discarded = true
            } else {
                let takeAction = true
                while (takeAction) {
                    const action: Action =
                        player.decideAction(this.shoe.calcTrueCount(), this.dealer.currentHand[0].value)
                    let newCard: Card
                    switch (action) {
                        case Action.DOUBLE:
                            player.currentHand.push(this.shoe.dealCard())
                            player.bankroll -= player.currentBet
                            player.currentBet *= 2
                            takeAction = false
                            break
                        case Action.HIT:
                            newCard = this.shoe.dealCard()
                            player.currentHand.push(newCard)
                            if (player.calcHandTotal() > 21) {
                                player.discarded = true
                                takeAction = false
                                break
                            }
                            break
                        case Action.SPLIT:
                            // TODO
                            break
                        case Action.STAND:
                            takeAction = false
                            break
                    }
                }
            }

            for (let i = this.activePlayers.length - 1; i >= 0; ++i)
                if (this.activePlayers[i].discarded)
                    this.bustedPlayers.push(this.activePlayers.splice(i, 1)[0])
        }
    }

    public dealerPlayRound(): void {
        let takeAction = true
        while (takeAction) {
            const action: Action = this.dealer.decideAction()
            let newCard: Card
            switch (action) {
                case Action.HIT:
                    newCard = this.shoe.dealCard()
                    this.dealer.currentHand.push(newCard)
                    if (this.dealer.calcHandTotal() > 21) {
                        this.dealer.busted = true
                        takeAction = false
                        break
                    }
                    break
                case Action.STAND:
                    takeAction = false
                    break
            }
        }
    }

    public cleanUp(): void {
        // TODO
    }
}

export enum Action { STAND, HIT, DOUBLE, SPLIT }

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
