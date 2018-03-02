// import Dealer from './dealer';
import Deck from './deck';
import Card from './card';

export default class Shoe {
    public numDecks: number;
    public cardsBeforeCut: number;
    private shoe: Card[];
    private discard: Card[];
    private current: Card[];
    public runningCount: number;
    private countValueMapping: object;

    constructor(numDecks: number, cardsBeforeCut: number, countValueMapping: object) {
        this.numDecks = numDecks;
        this.cardsBeforeCut = cardsBeforeCut;
        this.runningCount = 0;
        this.countValueMapping = countValueMapping;
        this.initShoe();
    }

    private initShoe(): void {
        this.shoe = [];
        this.current = [];
        this.discard = [];

        for (let i: number = 0; i < this.numDecks; ++i) {
            let deck: Deck = new Deck();
            deck.shuffleDeck();
            this.shoe.push.apply(this.shoe, deck.cardsNotDealt);
        }

        this.shuffleShoe();
    }

    public shuffleShoe() {
        for (let i = 0; i < this.shoe.length; ++i) {
            let index1: number = Math.floor(Math.random() * 52);
            let index2: number = Math.floor(Math.random() * 52);
            let temp: Card = this.shoe[index1];
            this.shoe[index1] = this.shoe[index2];
            this.shoe[index2] = temp;
        }
    }

    public dealCard(): Card {
        let card: Card = this.shoe.shift();
        this.current.push(card);
        this.runningCount += this.countValueMapping[card.value];
        return card;
    }

    public calcTrueCount(): number {
        // Based on closest number of 1/4 decks left in the undealt shoe.
        // Result if truncated because a true count must be reached before betting...
        // according to that count. (e.g. TC = 1.99 = 1)
        return this.runningCount / Math.round(this.shoe.length / 13);
    }

    public setCountMap(countMap: object) {
        this.countValueMapping = countMap;
    }

    public isEmpty(): boolean {
        return this.shoe.length == 0;
    }

    public hasReachedCut(): boolean {
        return this.discard.length + this.current.length >= this.cardsBeforeCut;
    }

    public printShoe(): void {
        for (let i = 0; i < this.shoe.length; ++i)
            this.shoe[i].toString();
    }
}