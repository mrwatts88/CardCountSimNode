import Card from "./card"
import Participant from "./participant"

export default class Dealer extends Participant {
    constructor() {
        super()
    }

    public decideAction(h17: boolean): number {
        const total = this.currentHand().calcHandTotal()
        if (total > 17)
            return Participant.actions.STAND
        else if (total < 17)
            return Participant.actions.HIT
        else
            if (!h17)
                return Participant.actions.STAND
            else
                if (!this.currentHand().hasAce())
                    return Participant.actions.STAND
                else
                    return this.currentHand().isSoft() ? Participant.actions.HIT : Participant.actions.STAND
    }

    public calcHandTotal(): number {
        return this.currentHand().calcHandTotal()
    }
}
