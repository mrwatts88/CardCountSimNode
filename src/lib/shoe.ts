import Card from "./card"
import Deck from "./deck"

export default class Shoe extends Deck {
    public numDecks: number
    public cardsBeforeCut: number
    public runningCount: number
    private countValueMapping: object

    constructor(numDecks: number, cardsBeforeCut: number, countValueMapping: object) {
        super()
        this.numDecks = numDecks
        this.cardsBeforeCut = cardsBeforeCut
        this.runningCount = 0
        this.countValueMapping = countValueMapping
    }

    public dealCard(): Card {
        const card: Card = super.dealCard()
        this.runningCount += this.countValueMapping[card.value]
        return card
    }

    public calcTrueCount(): number {
        // Based on closest number of 1/4 decks left in the undealt shoe.
        // Result if truncated because a true count must be reached before betting...
        // according to that count. (e.g. TC = 1.99 = 1)
        return this.runningCount / Math.round(this.cardsNotDealt.length / 13)
    }

    public setCountMap(countMap: object) {
        this.countValueMapping = countMap
    }

    public hasReachedCut(): boolean {
        return this.cardsDealt.length >= this.cardsBeforeCut
    }

    public init(): void {
        super.init()
        for (let i = 1; i < this.numDecks; ++i)
            this.addShuffledDeck(new Deck())
    }

    private addShuffledDeck(deck: Deck) {
        deck.init()
        deck.shuffle()
        while (!deck.isEmpty())
            this.cardsNotDealt.push(deck.dealCard())
    }
}
