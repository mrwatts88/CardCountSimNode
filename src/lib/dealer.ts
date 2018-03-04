import Card from "./card"

enum Action { STAND, HIT, DOUBLE, SPLIT }

export default class Dealer {
    public static actions = Action;
    private currentHand: Card[]
    public busted

    constructor() {
        this.currentHand = []
        this.busted = false
    }

    public decideAction(): Action {
        // TODO
        return Action.STAND
    }

    public calcHandTotal(): number {
        // TODO

        let total: number = this.currentHand.reduce((prev, cur) => {
            return prev + cur.valAsInt()
        }, 0)

        let mightHaveAce: boolean = true
        if (total > 21)
            for (let card of this.currentHand)
                if (card.value == 1) {
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
}

