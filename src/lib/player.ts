import { DEBUG } from '../utils'
import Card from './card'
import Hand from './hand'
import Participant, { Action } from './participant'
import { IStrategy } from './strategy'

export default class Player extends Participant {
  public bankroll: number
  public currentBet: number
  public currentInsuranceBet: number
  private bettingRamp: Map<number, number>
  private ill18: boolean
  private basicStrategy: IStrategy

  constructor(basicStrategy: IStrategy, ill18: boolean, bettingRamp: number[]) {
    super()
    this.basicStrategy = basicStrategy
    this.ill18 = ill18
    this.bettingRamp = new Map()
    for (let i = 1; i < 11; ++i) this.bettingRamp.set(i, bettingRamp[i - 1])
    this.currentBet = 0
    this.currentInsuranceBet = 0
    this.bankroll = 0
  }

  public usingIll18(): boolean {
    return this.ill18
  }

  public addHandForSplit(bet: number, card: Card): void {
    const hand = new Hand()
    hand.setBet(bet)
    hand.addCardToHand(card)
    this.hands.splice(this.currentHandIndex, 0, hand)
  }

  public placeBet(count: number): void {
    this.currentBet = this.bettingRamp.get(count)
    if (this.currentBet === undefined) this.currentBet = 1
    this.currentHand().bet = this.currentBet
    this.bankroll -= this.currentBet
    DEBUG(
      `Player's bet: ${this.currentBet} - Bankroll after bet: ${this.bankroll}`
    )
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
}
