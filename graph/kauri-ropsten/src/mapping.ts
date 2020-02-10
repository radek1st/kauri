import {
  OwnershipRenounced as OwnershipRenouncedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  TokensStaked as TokensStakedEvent,
  TokensUnstaked as TokensUnstakedEvent
} from "../generated/Contract/Contract"
import {
  OwnershipRenounced,
  OwnershipTransferred,
  TokensStaked,
  TokensUnstaked
} from "../generated/schema"

export function handleOwnershipRenounced(event: OwnershipRenouncedEvent): void {
  let entity = new OwnershipRenounced(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner
  entity.save()
}

export function handleTokensStaked(event: TokensStakedEvent): void {
  let entity = new TokensStaked(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.stakedBy = event.params.stakedBy
  entity.stakedFor = event.params.stakedFor
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
