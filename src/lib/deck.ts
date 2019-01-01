import Card from './card'

export default class Deck {
  public static NUMBER_OF_SUITS = 4
  public static NUMBER_OF_RANKS = 13

  protected cardsNotDealt: Card[]
  protected cardsDealt: Card[]

  constructor() {
    this.cardsNotDealt = []
    this.cardsDealt = []
  }

  public shuffle(): void {
    this.cardsNotDealt.forEach(() => {
      const c1 = Math.floor(Math.random() * this.cardsNotDealt.length)
      const c2 = Math.floor(Math.random() * this.cardsNotDealt.length)
      const temp: Card = this.cardsNotDealt[c1]
      this.cardsNotDealt[c1] = this.cardsNotDealt[c2]
      this.cardsNotDealt[c2] = temp
    })
  }

  public dealCard(): Card {
    const card: Card = this.cardsNotDealt.shift()
    this.cardsDealt.push(card)
    return card
  }

  public isEmpty(): boolean {
    return this.cardsNotDealt.length === 0
  }

  public init(): void {
    this.cardsNotDealt = []
    this.cardsDealt = []
    for (let suit: number = 0; suit < Deck.NUMBER_OF_SUITS; ++suit)
      for (let value: number = 0; value < Deck.NUMBER_OF_RANKS; ++value)
        this.cardsNotDealt[Deck.NUMBER_OF_RANKS * suit + value] = new Card(
          suit,
          value + 1
        )
  }

  public toString(): string {
    let dealtString: string = 'Dealt: '
    let notDealtString: string = 'Not dealt: '
    for (const card of this.cardsDealt) dealtString += card.toString() + ' '
    for (const card of this.cardsNotDealt)
      notDealtString += card.toString() + ' '

    return dealtString + '\n' + notDealtString
  }
}
