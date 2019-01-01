import { DEBUG } from '../utils'
import Card from './card'
import Dealer from './dealer'
import Participant from './participant'
import Player from './player'
import { IRuleSet } from './rules'
import Shoe from './shoe'

export default class Game {
  public dealer: Dealer
  private activePlayers: Map<number, Player>
  private numPlayers: number
  public shoe: Shoe
  private roundIsOver: boolean
  private ruleSet: IRuleSet

  constructor(ruleSet: IRuleSet) {
    this.numPlayers = 0
    this.ruleSet = ruleSet
    this.roundIsOver = true
    this.activePlayers = new Map<number, Player>()
    this.dealer = new Dealer()
    this.shoe = new Shoe(NUMBER_OF_DECKS, CARDS_AFTER_CUT, hiLoCountMap)
    this.shoe.shuffle()
  }

  public getActivePlayers(): Map<number, Player> {
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
    this.activePlayers.set(this.numPlayers, player)
  }

  public placeBets(): void {
    this.roundIsOver = false
    const trueCount = this.shoe.calcTrueCount()
    this.activePlayers.forEach(p => p.placeBet(trueCount))
  }

  public dealRound(): void {
    // TODO: Check that all active players have placed a bet
    this.activePlayers.forEach(p => {
      p.addCardToInitialHand(this.shoe.dealCard())
    })
    this.dealer.addCardToInitialHand(this.shoe.dealCard())
    this.activePlayers.forEach(p => {
      p.addCardToInitialHand(this.shoe.dealCard())
    })
    this.dealer.addCardToInitialHand(this.shoe.dealCard())
  }

  public placeInsuranceBets(): void {
    if (this.dealer.currentHand().getCardAt(0).value !== 1) return
    this.activePlayers.forEach(p => {
      if (
        p.usingIll18() &&
        this.shoe.calcTrueCount() >= Ill18Indices.insurance
      ) {
        p.currentInsuranceBet = 0.5 * p.currentBet
        p.makeBet(p.currentInsuranceBet)
      }
    })
  }

  public resolveInsurance(): void {
    if (this.dealer.currentHand().getCardAt(0).value !== 1) return
    this.activePlayers.forEach(p => {
      if (
        this.dealer
          .currentHand()
          .getCardAt(1)
          .valAsInt() === 10
      )
        p.bankroll += 3 * p.currentInsuranceBet
      p.currentInsuranceBet = 0
    })
  }

  public playersPlayRound(): void {
    this.activePlayers.forEach(p => {
      for (let i = 0; i < p.hands.length; ++i) {
        if (p.hands[i].bustedOrDiscarded) continue
        p.currentHandIndex = i
        if (p.hands[i].numCards() === 1)
          p.hands[i].addCardToHand(this.shoe.dealCard())
        if (i === 0 && p.hands[i].hasBlackjack()) {
          DEBUG('Player has blackjack')
          p.resolveBet(BLACKJACK_MULTIPLIER, p.hands[i].bet)
          p.hands[i].bustedOrDiscarded = true
        } else {
          let takeAction = true
          while (takeAction) {
            const action: number = p.decideAction(
              this.shoe.calcTrueCount(),
              this.dealer
                .currentHand()
                .getCardAt(0)
                .valAsInt()
            )

            switch (action) {
              case Participant.actions.DOUBLE:
                // Can't double, just hit
                if (p.hands[i].numCards() !== 2) {
                  p.hands[i].addCardToHand(this.shoe.dealCard())
                  if (p.hands[i].calcHandTotal() > 21) {
                    p.hands[i].bustedOrDiscarded = true
                    takeAction = false
                  }
                } else {
                  p.hands[i].addCardToHand(this.shoe.dealCard())
                  p.makeBet(p.currentBet)
                  p.hands[i].bet = p.hands[i].bet * 2
                  p.currentBet *= 2
                  if (p.hands[i].calcHandTotal() > 21)
                    p.hands[i].bustedOrDiscarded = true

                  takeAction = false
                }
                break
              case Participant.actions.HIT:
                p.hands[i].addCardToHand(this.shoe.dealCard())
                if (p.hands[i].calcHandTotal() > 21) {
                  p.hands[i].bustedOrDiscarded = true
                  takeAction = false
                }
                break
              case Participant.actions.SPLIT:
                p.makeBet(p.currentBet)
                p.addHandForSplit(p.currentBet, p.hands[i].removeCardAt(1))
                p.hands[i].addCardToHand(this.shoe.dealCard())
                takeAction = true
                break
              case Participant.actions.STAND:
                takeAction = false
                break
              case Participant.actions.DS:
                // Can't double, just stand
                if (p.hands[i].numCards() !== 2) takeAction = false
                else {
                  p.hands[i].addCardToHand(this.shoe.dealCard())
                  p.makeBet(p.currentBet)
                  p.hands[i].bet = p.hands[i].bet * 2
                  p.currentBet *= 2
                  if (p.hands[i].calcHandTotal() > 21)
                    p.hands[i].bustedOrDiscarded = true
                  takeAction = false
                }
                break
            }
          }
        }
      }
    })
  }

  public playersLeft(): boolean {
    let players = false
    this.activePlayers.forEach(p => {
      for (const hand of p.hands)
        if (!hand.bustedOrDiscarded) {
          players = true
          break
        }
    })
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
    this.activePlayers.forEach(p => {
      for (const hand of p.hands) {
        if (hand.bustedOrDiscarded) continue

        if (this.dealer.hasBlackjack())
          hand.hasBlackjack()
            ? p.resolveBet(0, hand.bet)
            : p.resolveBet(-1, hand.bet)
        else if (this.dealer.currentHand().bustedOrDiscarded)
          p.resolveBet(1, hand.bet)
        else {
          const diff =
            hand.calcHandTotal() - this.dealer.currentHand().calcHandTotal()
          if (diff > 0) p.resolveBet(1, hand.bet)
          else if (diff < 0) p.resolveBet(-1, hand.bet)
          else p.resolveBet(0, hand.bet)
        }
      }
    })
  }

  public getNumPlayers(): number {
    return this.numPlayers
  }

  public getPlayerAt(i: number): Player {
    if (i < 1) throw new Error('Invalid index for player')
    if (this.activePlayers.size < i) throw new Error('No player here')
    return this.activePlayers.get(i)
  }

  public getDealer(): Dealer {
    return this.dealer
  }

  public cleanUp(): void {
    this.activePlayers.forEach(p => p.reset())
    this.dealer.reset()
    this.roundIsOver = true
  }

  public printGame(): void {
    // public dealer: Dealer
    // private activePlayers: Map<number, Player>
    // private numPlayers: number
    // private shoe: Shoe
    // private roundIsOver: boolean
    // private ruleSet: IRuleSet
  }
}

// Constants, enums, etc
const BLACKJACK_MULTIPLIER = 1.5
const NUMBER_OF_DECKS = 6
const CARDS_AFTER_CUT = 52

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

const Ill18Indices = {
  insurance: 3,
}
