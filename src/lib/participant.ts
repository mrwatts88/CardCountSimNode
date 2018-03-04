import Card from "./card"

enum Action { STAND, HIT, DOUBLE, SPLIT }

export default abstract class Participant {
    public static actions = Action
    private currentHand: Card[]
    private bustedOrDiscarded: boolean

    constructor() {
        this.currentHand = []
        this.bustedOrDiscarded = false
    }

    public abstract decideAction(count: number, dealerUpcardVal: number): Action

    public calcHandTotal(): number {
        let total: number = this.currentHand.reduce((prev, cur) => {
            return prev + cur.valAsInt()
        }, 0)

        const mightHaveAce: boolean = true
        if (total > 21)
            for (const card of this.currentHand)
                if (card.value === 1) {
                    total -= 10
                    if (total < 22) break
                }

        return total
    }

    public addCardToHand(card: Card): void {
        this.currentHand.push(card)
    }

    public getCardAt(position: number): Card {
        return this.currentHand[position]
    }

    public hasBlackjack(): boolean {
        // TODO
        return false
    }
}
