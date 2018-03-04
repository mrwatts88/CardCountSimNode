import Card from "./card"
import Participant from "./participant"

export default class Dealer extends Participant {
    constructor() {
        super()
    }

    public decideAction(): number {
        // TODO
        return Participant.actions.STAND
    }
}
