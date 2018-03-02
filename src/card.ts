export default class Card {

    public suit: Suit;
    public value: number;

    constructor(suit: Suit, value: number) {
        this.suit = suit;
        this.value = value;
    }

    public toString() {
        return this.valToString(this.value) + Suit[this.suit];
    }

    public valToString(value: number) {
        switch (value) {
            case 1:
                return 'A';
            case 2:
                return '2';
            case 3:
                return '3';
            case 4:
                return '4';
            case 5:
                return '5';
            case 6:
                return '6';
            case 7:
                return '7';
            case 8:
                return '8';
            case 9:
                return '9';
            case 10:
                return 'T';
            case 11:
                return 'J';
            case 12:
                return 'Q';
            case 13:
                return 'K';
        }
    }
}

export enum Suit {
    C,
    D,
    H,
    S
}
