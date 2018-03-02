import Card from './card';

export default class Deck {
    public cardsNotDealt: Card[];
    private cardsDealt: Card[];

    constructor() {
        this.cardsNotDealt = this.initDeck();
    }

    private initDeck(): Card[] {
        let arr = [];
        for (let suit: number = 0; suit < 4; ++suit)
            for (let value: number = 0; value < 13; ++value)
                arr[13 * suit + value] = new Card(suit, value + 1);
        return arr;
    }

    public shuffleDeck() {
        for (let i = 0; i < this.cardsNotDealt.length; ++i) {
            let index1 = Math.floor(Math.random() * 52);
            let index2 = Math.floor(Math.random() * 52);
            let temp: Card = this.cardsNotDealt[index1];
            this.cardsNotDealt[index1] = this.cardsNotDealt[index2];
            this.cardsNotDealt[index2] = temp;
        }
    }

    public printDeck(): void {
        for (let i = 0; i < this.cardsNotDealt.length; ++i)
            this.cardsNotDealt[i].toString();
    }
}