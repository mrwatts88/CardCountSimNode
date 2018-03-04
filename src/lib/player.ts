import Card from "./card"
import Participant from "./participant"

export default class Player extends Participant {
    public bankroll: number
    public currentBet: number
    private bettingRamp: Map<number, number>
    private ill18: boolean

    constructor(bettingRamp: number[], ill18: boolean) {
        super();
        this.ill18 = ill18
        this.bettingRamp = new Map()
        for (let i = 1; i < 11; ++i)
            this.bettingRamp.set(i, bettingRamp[i - 1])
        this.currentBet = 0
        this.bankroll = 0
    }

    public usingIll18(): boolean {
        return this.ill18
    }

    public placeBet(count: number) {
        this.currentBet = this.bettingRamp.get(count)
        if (this.currentBet === undefined)
            this.currentBet = 1

        this.bankroll -= this.currentBet
    }

    public resolveBet(multiplier) {
        // 0 = loss, 0.5 = push, 1 = even money win, 1.2 = 6 to 5, 1.5 = 3 to 2
        this.bankroll += multiplier === 0 ? 0 : (this.currentBet * (multiplier + 1))
    }

    public decideAction(count: number, dealerUpcardVal: number): number {
        // TODO: implement basic strategy here, take into account ill18
        return Participant.actions.STAND
    }
}
