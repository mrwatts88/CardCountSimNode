import Card from "./card"
import Hand from "./hand"

enum Action { STAND, HIT, DOUBLE, SPLIT, DS }

export default abstract class Participant {
    public static actions = Action
    public hands: Hand[]
    public currentHandIndex: number

    constructor() {
        this.hands = [new Hand()]
        this.currentHandIndex = 0
    }

    public currentHand(): Hand {
        return this.hands[this.currentHandIndex]
    }

    public hasBlackjack(): boolean {
        return this.hands[0].hasBlackjack()
    }

    public addCardToInitialHand(card: Card) {
        this.hands[0].addCardToHand(card)
    }
}
