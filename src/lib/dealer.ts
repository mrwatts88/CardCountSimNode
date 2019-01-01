import { DEBUG } from './utils'
import {Card} from './card'
import {Participant} from './participant'

export class Dealer extends Participant {
  constructor() {
    super()
  }

  public decideAction(h17: boolean): number {
    const total = this.calcHandTotal()
    if (total > 21)
      throw Error('Total is over 21, should not be deciding action.')
    if (total > 17) {
      DEBUG(`Dealer standing with: ${total}`)
      return Participant.actions.STAND
    } else if (total < 17) {
      DEBUG(`Dealer hitting with: ${total}`)
      return Participant.actions.HIT
    } else if (!h17) {
      DEBUG(`Dealer standing with: ${total}`)
      return Participant.actions.STAND
    } else if (!this.hasAce()) {
      DEBUG(`Dealer standing with: ${total}`)
      return Participant.actions.STAND
    } else {
      if (this.isSoft()) DEBUG(`Dealer hitting with: ${total}`)
      else DEBUG(`Dealer standing with: ${total}`)
      return this.isSoft()
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
    const hasIt = this.currentHand().hasBlackjack()
    if (hasIt) DEBUG('Dealer has Blackjack.')
    return hasIt
  }

  public clearHand(): void {
    return this.currentHand().clearHand()
  }
}
