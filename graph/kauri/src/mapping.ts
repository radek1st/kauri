import {
  TokensStaked as TokensStakedEvent,
  TokensUnstaked as TokensUnstakedEvent
} from "../generated/Contract/Contract"
import { TokensStaked, TokensUnstaked } from "../generated/schema"

export function handleTokensStaked(event: TokensStakedEvent): void {
  let entity = new TokensStaked(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.staker = event.params.staker
  entity.time = event.params.time
  entity.duration = event.params.duration
  entity.amount = event.params.amount
  entity.save()
}

export function handleTokensUnstaked(event: TokensUnstakedEvent): void {
  let entity = new TokensUnstaked(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.staker = event.params.staker
  entity.time = event.params.time
  entity.amount = event.params.amount
  entity.remaining = event.params.remaining
  entity.save()
}
