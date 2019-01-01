import { DEBUG } from './utils'
import {Card} from './card'
import {Deck} from './deck'

export class Shoe extends Deck {
  public numDecks: number
  public cardsAfterCut: number
  public runningCount: number
  private countValueMapping: object

  constructor(
    numDecks: number,
    cardsAfterCut: number,
    countValueMapping: object
  ) {
    super()
    this.numDecks = numDecks
    this.cardsAfterCut = cardsAfterCut
    this.runningCount = 0
    this.countValueMapping = countValueMapping
  }

  public dealCard(): Card {
    const card: Card = super.dealCard()
    this.runningCount += this.countValueMapping[card.value]
    DEBUG(`Dealt ${card} - Running count: ${this.runningCount}`)
    return card
  }

  public calcTrueCount(): number {
    // Based on closest number of 1/2 decks left in the undealt shoe.
    // Result is truncated because a true count must be reached before betting...
    // according to that count. (e.g. TC = 1.99 = 1)
    const denominator = 0.5 * Math.ceil(this.cardsNotDealt.length / 26)
    let trueCount = denominator === 0 ? 0 : this.runningCount / denominator
    trueCount = Math.floor(trueCount)
    DEBUG(
      `True count: ${trueCount}, Cards remaining: ${this.cardsNotDealt.length}`
    )
    return trueCount
  }

  public setCountMap(countMap: object) {
    this.countValueMapping = countMap
  }

  public getCountMap(): object {
    return this.countValueMapping
  }

  public hasReachedCutCard(): boolean {
    const reached: boolean = this.cardsNotDealt.length <= this.cardsAfterCut
    if (reached)
      DEBUG(
        `Reached the cut card with ${this.cardsNotDealt.length} cards left.`
      )
    return reached
  }

  public shuffle(): void {
    for (let i = 0; i < this.numDecks; ++i) this.addShuffledDeck(new Deck())
    super.shuffle()
    this.runningCount = 0
  }

  private addShuffledDeck(deck: Deck) {
    deck.init()
    deck.shuffle()
    while (!deck.isEmpty()) this.cardsNotDealt.push(deck.dealCard())
  }
}
