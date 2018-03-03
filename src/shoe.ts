// import Dealer from "./dealer";
import Card from "./card"
import Deck from "./deck"

export default class Shoe {
    public numDecks: number
    public cardsBeforeCut: number
    public runningCount: number
    private current: Card[]
    private countValueMapping: object
    private shoe: Card[]
    private discard: Card[]

    constructor(numDecks: number, cardsBeforeCut: number, countValueMapping: object) {
        this.numDecks = numDecks
        this.cardsBeforeCut = cardsBeforeCut
        this.runningCount = 0
        this.countValueMapping = countValueMapping
        this.initShoe()
    }

    public shuffleShoe() {
        for (const i of this.shoe) {
            const index1: number = Math.floor(Math.random() * 52)
            const index2: number = Math.floor(Math.random() * 52)
            const temp: Card = this.shoe[index1]
            this.shoe[index1] = this.shoe[index2]
            this.shoe[index2] = temp
        }
    }

    public dealCard(): Card {
        const card: Card = this.shoe.shift()
        this.current.push(card)
        this.runningCount += this.countValueMapping[card.value]
        return card
    }

    public calcTrueCount(): number {
        // Based on closest number of 1/4 decks left in the undealt shoe.
        // Result if truncated because a true count must be reached before betting...
        // according to that count. (e.g. TC = 1.99 = 1)
        return this.runningCount / Math.round(this.shoe.length / 13)
    }

    public setCountMap(countMap: object) {
        this.countValueMapping = countMap
    }

    public isEmpty(): boolean {
        return this.shoe.length === 0
    }

    public hasReachedCut(): boolean {
        return this.discard.length + this.current.length >= this.cardsBeforeCut
    }

    public printShoe(): void {
        for (const c of this.shoe)
            c.toString()
    }

    private initShoe(): void {
        this.shoe = []
        this.current = []
        this.discard = []

        for (let i: number = 0; i < this.numDecks; ++i) {
            const deck: Deck = new Deck()
            deck.shuffleDeck()
            this.shoe.push.apply(this.shoe, deck.cardsNotDealt)
        }

        this.shuffleShoe()
    }
}
