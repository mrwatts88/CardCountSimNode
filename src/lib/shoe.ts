import Card from './card'
import Deck from './deck'

export default class Shoe extends Deck {
  public numDecks: number
  public cardsBeforeCut: number
  public runningCount: number
  private countValueMapping: object

  constructor(
    numDecks: number,
    cardsBeforeCut: number,
    countValueMapping: object
  ) {
    super()
    this.numDecks = numDecks
    this.cardsBeforeCut = cardsBeforeCut
    this.runningCount = 0
    this.countValueMapping = countValueMapping
  }

  public dealCard(): Card {
    const card: Card = super.dealCard()
    this.runningCount += this.countValueMapping[card.value]
    console.info(`Dealt ${card} - Running count: ${this.runningCount}`)
    return card
  }

  public calcTrueCount(): number {
    // Based on closest number of 1/4 decks left in the undealt shoe.
    // Result is truncated because a true count must be reached before betting...
    // according to that count. (e.g. TC = 1.99 = 1)
    let trueCount = Math.round(
      this.runningCount / this.cardsNotDealt.length / 13
    ) // Cards not dealt cannot be less than 13
    console.info(
      `True count: ${trueCount}, Cards remaining: ${this.cardsNotDealt.length}`
    )
    return trueCount
  }

  public setCountMap(countMap: object) {
    this.countValueMapping = countMap
  }

  public hasReachedCutCard(): boolean {
    const reached: boolean = this.cardsDealt.length >= this.cardsBeforeCut
    if (reached)
      console.info(
        `Reached the cut card with ${this.cardsNotDealt.length} cards left.`
      )
    return reached
  }

  public init(): void {
    super.init()
    for (let i = 1; i < this.numDecks; ++i) this.addShuffledDeck(new Deck())
  }

  private addShuffledDeck(deck: Deck) {
    deck.init()
    deck.shuffle()
    while (!deck.isEmpty()) this.cardsNotDealt.push(deck.dealCard())
  }
}
