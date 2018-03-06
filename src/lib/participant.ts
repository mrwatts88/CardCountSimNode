import Card from "./card"

enum Action { STAND, HIT, DOUBLE, SPLIT, DS }

export default abstract class Participant {
    public static actions = Action
    public bustedOrDiscarded: boolean
    protected currentHand: Card[]

    constructor() {
        this.currentHand = []
        this.bustedOrDiscarded = false
    }

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
        if (this.currentHand.length !== 2) return false
        return (this.currentHand[0].value === 1 && this.currentHand[1].valAsInt() === 10) ||
            (this.currentHand[1].value === 1 && this.currentHand[0].valAsInt() === 10)
    }
}
