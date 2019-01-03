import { DEBUG } from './utils'
import { Card } from './card'
import { Hand } from './hand'
import { Participant, Action } from './participant'
import { IStrategy } from './strategy'

export class Player extends Participant {
  public bankroll: number
  public currentBet: number
  public currentInsuranceBet: number
  private bettingRamp: object
  private ill18: boolean
  private basicStrategy: IStrategy
  private totalBet: number

  constructor(basicStrategy: IStrategy, ill18: boolean, bettingRamp: number[]) {
    super()
    this.basicStrategy = basicStrategy
    this.ill18 = ill18
    this.bettingRamp = {}
    for (let i = 0; i < 11; ++i) this.bettingRamp[i] = bettingRamp[i]
    this.currentBet = 0
    this.currentInsuranceBet = 0
    this.bankroll = 0
    this.totalBet = 0
  }

  public usingIll18(): boolean {
    return this.ill18
  }

  public getTotalBet() {
    return this.totalBet
  }

  public addHandForSplit(bet: number, card: Card): void {
    const hand = new Hand()
    hand.setBet(bet)
    hand.addCardToHand(card)
    this.hands.splice(this.currentHandIndex, 0, hand)
  }

  public placeBet(count: number): void {
    let adjustedCount: number = count
    if (count < 1) adjustedCount = 0
    if (count > 10) adjustedCount = 10
    this.currentBet = this.bettingRamp[adjustedCount]
    this.currentHand().bet = this.currentBet
    this.makeBet(this.currentBet)
    DEBUG(
      `Player's bet: ${this.currentBet} - Bankroll after bet: ${this.bankroll}`
    )
  }

  public makeBet(amount: number) {
    this.totalBet += amount
    this.bankroll -= amount
  }

  public resolveBet(multiplier: number, bet: number): void {
    // -1 = loss, 0 = push, 1 = even money win, 1.2 = 6 to 5, 1.5 = 3 to 2
    this.bankroll += multiplier === -1 ? 0 : bet * (multiplier + 1)
    DEBUG(`Player's Bankroll after bet resolution: ${this.bankroll}`)
  }

  public decideAction(count: number, dealerUpcardValAsInt: number): number {
    // TODO: Take into account ill18
    if (this.currentHandIndex === null)
      throw new Error('There is no current hand to take action on')
    let action: Action
    if (this.currentHand().isPair())
      action = this.basicStrategy.PAIRS[dealerUpcardValAsInt][
        this.currentHand()
          .getCardAt(0)
          .valAsInt()
      ]
    else if (
      !this.currentHand().hasAce() ||
      (this.currentHand().hasAce() && !this.currentHand().isSoft())
    )
      action = this.basicStrategy.HARD[dealerUpcardValAsInt][
        this.currentHand().calcHandTotal()
      ]
    else
      action = this.basicStrategy.SOFT[dealerUpcardValAsInt][
        this.currentHand().calcHandTotal()
      ]

    let actionString: string
    switch (action) {
      case Participant.actions.SPLIT:
        actionString = 'splitting'
        break
      case Participant.actions.DOUBLE:
        actionString = 'doubling'
        break
      case Participant.actions.STAND:
        actionString = 'standing'
        break
      case Participant.actions.HIT:
        actionString = 'hitting'
        break
      case Participant.actions.DS:
        actionString = 'doubling/splitting'
        break
      default:
        break
    }

    DEBUG(
      `Player's hand: ${this.currentHand().toString()}- ${actionString} with ${this.currentHand().calcHandTotal()}`
    )

    return action
  }

  public getStats() {
    return {
      totalBet: `${this.totalBet} units`,
      profit: `${this.bankroll} units`,
      edge:
        this.totalBet === 0
          ? '0.00%'
          : `${((100 * this.bankroll) / this.totalBet).toFixed(5)}%`,
    }
  }
}
