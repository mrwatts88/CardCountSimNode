import Card from "./card"

export default class Deck {
    private cardsNotDealt: Card[]
    private cardsDealt: Card[]

    constructor() {
        this.initDeck()
    }

    public shuffleDeck(): void {
        this.initDeck()
        for (const i of this.cardsNotDealt) {
            const c1 = Math.floor(Math.random() * 52)
            const c2 = Math.floor(Math.random() * 52)
            const temp: Card = this.cardsNotDealt[c1]
            this.cardsNotDealt[c1] = this.cardsNotDealt[c2]
            this.cardsNotDealt[c2] = temp
        }
    }

    public printDeck(): void {
        for (const card of this.cardsNotDealt)
            console.log(card.toString())
    }

    public dealCard(): Card {
        const card: Card = this.cardsNotDealt.shift();
        this.cardsDealt.push(card);
        return card;
    }

    public isEmpty(): boolean {
        return this.cardsNotDealt.length === 0;
    }

    private initDeck(): void {
        this.cardsNotDealt = [];
        this.cardsDealt = []
        for (let suit: number = 0; suit < 4; ++suit)
            for (let value: number = 0; value < 13; ++value)
                this.cardsDealt[13 * suit + value] = new Card(suit, value + 1)
    }
}
