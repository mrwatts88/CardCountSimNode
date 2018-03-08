import Card from "./card"

export default class Hand {
    public bustedOrDiscarded: boolean
    public bet: number
    private hand: Card[]

    constructor() {
        this.bustedOrDiscarded = false
        this.bet = 0
        this.hand = []
    }

    public numCards(): number {
        return this.hand.length
    }

    public hasAce(): boolean {
        for (let card of this.hand)
            if (card.value == 1)
                return true
        return false
    }

    public isPair(): boolean {
        return this.numCards() === 2 && this.getCardAt(0).valAsInt() === this.getCardAt(1).valAsInt()
    }

    public isSoft(): boolean {
        // TODO
        return false;
    }

    public calcHandTotal(): number {
        let total: number = this.hand.reduce((prev, cur) => {
            return prev + cur.valAsInt()
        }, 0)
        const mightHaveAce: boolean = true
        if (total > 21)
            for (const card of this.hand)
                if (card.value === 1) {
                    total -= 10
                    if (total < 22) break
                }
        return total
    }

    public addCardToHand(card: Card): void {
        this.hand.push(card)
    }

    public getCardAt(position: number): Card {
        return this.hand[position]
    }

    public hasBlackjack(): boolean {
        if (this.hand.length !== 2) return false
        return (this.hand[0].value === 1 && this.hand[1].valAsInt() === 10) ||
            (this.hand[1].value === 1 && this.hand[0].valAsInt() === 10)
    }

    public clearHand(): void {
        this.hand = []
    }
}