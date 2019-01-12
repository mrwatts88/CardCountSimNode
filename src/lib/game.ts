import { DEBUG } from './utils'
import { Card } from './card'
import { Dealer } from './dealer'
import { Participant } from './participant'
import { Player } from './player'
import { IRuleSet } from './rules'
import { Shoe } from './shoe'

export class Game {
  public dealer: Dealer
  private activePlayers: object
  private numPlayers: number
  public shoe: Shoe
  private roundIsOver: boolean
  private ruleSet: IRuleSet

  constructor(ruleSet: IRuleSet) {
    this.numPlayers = 0
    this.ruleSet = ruleSet
    this.roundIsOver = true
    this.activePlayers = {}
    this.dealer = new Dealer()
    this.shoe = new Shoe(NUMBER_OF_DECKS, CARDS_AFTER_CUT, hiLoCountMap)
    this.shoe.shuffle()
  }

  public getActivePlayers(): object {
    return this.activePlayers
  }

  public getTrueCount(): number {
    return this.shoe.calcTrueCount()
  }

  public shuffleShoe(): void {
    this.shoe.shuffle()
  }

  public hasReachedCutCard(): boolean {
    return this.shoe.hasReachedCutCard()
  }

  public addPlayer(player: Player): void {
    if (!this.roundIsOver) throw new Error('Cannot add player during round.')
    ++this.numPlayers
    this.activePlayers[this.numPlayers] = player
  }

  public placeBets(): void {
    this.roundIsOver = false
    const trueCount = this.shoe.calcTrueCount()
    for (const p in this.activePlayers) this.activePlayers[p].placeBet(trueCount);
  }

  public dealRound(): void {
    // TODO: Check that all active players have placed a bet

    for (const p in this.activePlayers) this.activePlayers[p].addCardToInitialHand(this.shoe.dealCard())

    this.dealer.addCardToInitialHand(this.shoe.dealCard())
    for (const p in this.activePlayers) this.activePlayers[p].addCardToInitialHand(this.shoe.dealCard())
    this.dealer.addCardToInitialHand(this.shoe.dealCard())
  }

  public placeInsuranceBets(): void {
    if (this.dealer.currentHand().getCardAt(0).value !== 1) return
    for (const p in this.activePlayers) {
      if (
        this.activePlayers[p].usingIll18() &&
        this.shoe.calcTrueCount() >= Ill18Indices.insurance
      ) {
        this.activePlayers[p].currentInsuranceBet = 0.5 * this.activePlayers[p].currentBet
        this.activePlayers[p].makeBet(this.activePlayers[p].currentInsuranceBet)
      }
    }
  }

  public resolveInsurance(): void {
    if (this.dealer.currentHand().getCardAt(0).value !== 1) return
    for (const p in this.activePlayers) {
      if (
        this.dealer
          .currentHand()
          .getCardAt(1)
          .valAsInt() === 10
      )
        this.activePlayers[p].bankroll += 3 * this.activePlayers[p].currentInsuranceBet
      this.activePlayers[p].currentInsuranceBet = 0
    }

  }

  public playersPlayRound(): void {

    for (const p in this.activePlayers) {

      for (let i = 0; i < this.activePlayers[p].hands.length; ++i) {
        if (this.activePlayers[p].hands[i].bustedOrDiscarded) continue
        this.activePlayers[p].currentHandIndex = i
        if (this.activePlayers[p].hands[i].numCards() === 1)
          this.activePlayers[p].hands[i].addCardToHand(this.shoe.dealCard())
        if (i === 0 && this.activePlayers[p].hands[i].hasBlackjack()) {
          DEBUG('Player has blackjack')
          this.activePlayers[p].resolveBet(BLACKJACK_MULTIPLIER, this.activePlayers[p].hands[i].bet)
          this.activePlayers[p].hands[i].bustedOrDiscarded = true
        } else {
          let takeAction = true
          while (takeAction) {
            const action: number = this.activePlayers[p].decideAction(
              this.shoe.calcTrueCount(),
              this.dealer
                .currentHand()
                .getCardAt(0)
                .valAsInt()
            )

            switch (action) {
              case Participant.actions.DOUBLE:
                // Can't double, just hit
                if (this.activePlayers[p].hands[i].numCards() !== 2) {
                  this.activePlayers[p].hands[i].addCardToHand(this.shoe.dealCard())
                  if (this.activePlayers[p].hands[i].calcHandTotal() > 21) {
                    this.activePlayers[p].hands[i].bustedOrDiscarded = true
                    takeAction = false
                  }
                } else {
                  this.activePlayers[p].hands[i].addCardToHand(this.shoe.dealCard())
                  this.activePlayers[p].makeBet(this.activePlayers[p].currentBet)
                  this.activePlayers[p].hands[i].bet = this.activePlayers[p].hands[i].bet * 2
                  this.activePlayers[p].currentBet *= 2
                  if (this.activePlayers[p].hands[i].calcHandTotal() > 21)
                    this.activePlayers[p].hands[i].bustedOrDiscarded = true

                  takeAction = false
                }
                break
              case Participant.actions.HIT:
                this.activePlayers[p].hands[i].addCardToHand(this.shoe.dealCard())
                if (this.activePlayers[p].hands[i].calcHandTotal() > 21) {
                  this.activePlayers[p].hands[i].bustedOrDiscarded = true
                  takeAction = false
                }
                break
              case Participant.actions.SPLIT:
                this.activePlayers[p].makeBet(this.activePlayers[p].currentBet)
                this.activePlayers[p].addHandForSplit(this.activePlayers[p].currentBet, this.activePlayers[p].hands[i].removeCardAt(1))
                this.activePlayers[p].hands[i].addCardToHand(this.shoe.dealCard())
                takeAction = true
                break
              case Participant.actions.STAND:
                takeAction = false
                break
              case Participant.actions.DS:
                // Can't double, just stand
                if (this.activePlayers[p].hands[i].numCards() !== 2) takeAction = false
                else {
                  this.activePlayers[p].hands[i].addCardToHand(this.shoe.dealCard())
                  this.activePlayers[p].makeBet(this.activePlayers[p].currentBet)
                  this.activePlayers[p].hands[i].bet = this.activePlayers[p].hands[i].bet * 2
                  this.activePlayers[p].currentBet *= 2
                  if (this.activePlayers[p].hands[i].calcHandTotal() > 21)
                    this.activePlayers[p].hands[i].bustedOrDiscarded = true
                  takeAction = false
                }
                break
            }
          }
        }
      }
    }
  }

  public playersLeft(): boolean {
    let players = false
    for (const p in this.activePlayers) {
      for (const hand of this.activePlayers[p].hands)
        if (!hand.bustedOrDiscarded) {
          players = true
          break
        }
    }
    return players
  }

  public dealerPlayRound(): void {
    if (!this.playersLeft()) {
      DEBUG('Dealer does nothing, no players left.')
      return
    }

    let takeAction = true
    while (takeAction) {
      const action: number = this.dealer.decideAction(this.ruleSet.h17)
      let newCard: Card
      switch (action) {
        case Participant.actions.HIT:
          newCard = this.shoe.dealCard()
          this.dealer.currentHand().addCardToHand(newCard)
          if (this.dealer.currentHand().calcHandTotal() > 21) {
            this.dealer.currentHand().bustedOrDiscarded = true
            takeAction = false
            break
          }
          break
        case Participant.actions.STAND:
          takeAction = false
          break
      }
    }
  }

  public resolveBets(): void {
    for (const p in this.activePlayers) {
      for (const hand of this.activePlayers[p].hands) {
        if (hand.bustedOrDiscarded) continue

        if (this.dealer.hasBlackjack())
          hand.hasBlackjack()
            ? this.activePlayers[p].resolveBet(0, hand.bet)
            : this.activePlayers[p].resolveBet(-1, hand.bet)
        else if (this.dealer.currentHand().bustedOrDiscarded)
          this.activePlayers[p].resolveBet(1, hand.bet)
        else {
          const diff =
            hand.calcHandTotal() - this.dealer.currentHand().calcHandTotal()
          if (diff > 0) this.activePlayers[p].resolveBet(1, hand.bet)
          else if (diff < 0) this.activePlayers[p].resolveBet(-1, hand.bet)
          else this.activePlayers[p].resolveBet(0, hand.bet)
        }
      }
    }
  }

  public getNumPlayers(): number {
    return this.numPlayers
  }

  public getPlayerAt(i: number): Player {
    if (i < 1) throw new Error('Invalid index for player')
    if (!this.activePlayers[i]) throw new Error('No player here')
    return this.activePlayers[i]
  }

  public getDealer(): Dealer {
    return this.dealer
  }

  public cleanUp(): void {
    for (const p in this.activePlayers) this.activePlayers[p].reset()
    this.dealer.reset()
    this.roundIsOver = true
  }
}

// Constants, enums, etc
const BLACKJACK_MULTIPLIER = 1.5
const NUMBER_OF_DECKS = 6
const CARDS_AFTER_CUT = 104

const hiLoCountMap = {
  1: -1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 0,
  8: 0,
  9: 0,
  10: -1,
  11: -1,
  12: -1,
  13: -1,
}

const feltCountMap = {
  1: -2,
  2: 1,
  3: 2,
  4: 2,
  5: 2,
  6: 2,
  7: 1,
  8: 0,
  9: 0,
  10: -2,
  11: -2,
  12: -2,
  13: -2,
}

const Ill18Indices = {
  insurance: 3,
}
