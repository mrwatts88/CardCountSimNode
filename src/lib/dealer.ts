import Card from "./card"
import Participant from "./participant"

export default class Dealer extends Participant {
    constructor() {
        super()
    }

    public decideAction(h17: boolean): number {
        const total = this.calcHandTotal()

        if (total > 17)
            return Participant.actions.STAND
        else if (total < 17)
            return Participant.actions.HIT
        else
            return h17 ? Participant.actions.HIT : Participant.actions.STAND
    }
}
