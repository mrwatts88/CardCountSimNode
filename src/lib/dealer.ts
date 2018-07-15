import Card from './card'
import Participant from './participant'

export default class Dealer extends Participant {
  constructor() {
    super()
  }

  public decideAction(h17: boolean): number {
    const total = this.calcHandTotal()
    if (total > 17) {
      console.info(`Dealer standing with: ${total}`)
      return Participant.actions.STAND
    } else if (total < 17) {
      console.info(`Dealer hitting with: ${total}`)
      return Participant.actions.HIT
    } else if (!h17) {
      console.info(`Dealer standing with: ${total}`)
      return Participant.actions.STAND
    } else if (!this.currentHand().hasAce()) {
      console.info(`Dealer standing with: ${total}`)
      return Participant.actions.STAND
    } else {
      if (this.currentHand().isSoft())
        console.info(`Dealer hitting with: ${total}`)
      else console.info(`Dealer standing with: ${total}`)
      return this.currentHand().isSoft()
        ? Participant.actions.HIT
        : Participant.actions.STAND
    }
  }

  public calcHandTotal(): number {
    return this.currentHand().calcHandTotal()
  }

  public numCards(): number {
    return this.currentHand().numCards()
  }

  public hasAce(): boolean {
    return this.currentHand().hasAce()
  }

  public isPair(): boolean {
    return this.currentHand().isPair()
  }

  public isSoft(): boolean {
    return this.currentHand().isSoft()
  }

  public addCardToHand(card: Card): void {
    return this.addCardToInitialHand(card)
  }

  public getCardAt(position: number): Card {
    return this.currentHand().getCardAt(position)
  }

  public hasBlackjack(): boolean {
    let hasIt = this.currentHand().hasBlackjack()
    if (hasIt) console.info('Dealer has Blackjack.')
    return hasIt
  }

  public clearHand(): void {
    return this.currentHand().clearHand()
  }
}
