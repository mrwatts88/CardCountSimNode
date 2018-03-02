import Game from "./game";
import Player from "./player";
import { expect } from 'chai';
import 'mocha';
import * as Card from "./card";

describe('test card', () => {
    let result;
    let suit = Card.Suit.C; // TODO: make this random or run a bunch of them.
    let val = 1; // TODO: this too

    before(() => {
        result = new Card.default(suit, val);
    })

    it('should construct with suit and value', () => {
        expect(result.suit).to.equal(suit);
        expect(result.value).to.equal(val);
    });

    it('should display val as string', () => {
        expect(result.toString()).to.equal('AC');
    })
});

// let game = new Game();
// let player = new Player([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], false);
// game.addPlayer(player);