import Card from './card';
import { Action } from './game';

export default class Dealer {
    public currentHand: Card[];
    public busted;

    constructor() {
        this.currentHand = [];
        this.busted = false;
    }

    public decideAction(): Action {
        // TODO
        return Action.STAND;
    }

    public calcHandTotal(): number {
        // TODO
        return 20;
    }
}