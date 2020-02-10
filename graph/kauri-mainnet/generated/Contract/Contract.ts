import {
  EthereumCall,
  EthereumEvent,
  SmartContract,
  EthereumValue,
  JSONValue,
  TypedMap,
  Entity,
  EthereumTuple,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class OwnershipRenounced extends EthereumEvent {
  get params(): OwnershipRenounced__Params {
    return new OwnershipRenounced__Params(this);
  }
}

export class OwnershipRenounced__Params {
  _event: OwnershipRenounced;

  constructor(event: OwnershipRenounced) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class OwnershipTransferred extends EthereumEvent {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class TokensStaked extends EthereumEvent {
  get params(): TokensStaked__Params {
    return new TokensStaked__Params(this);
  }
}

export class TokensStaked__Params {
  _event: TokensStaked;

  constructor(event: TokensStaked) {
    this._event = event;
  }

  get stakedBy(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get stakedFor(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get time(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get duration(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class TokensUnstaked extends EthereumEvent {
  get params(): TokensUnstaked__Params {
    return new TokensUnstaked__Params(this);
  }
}

export class TokensUnstaked__Params {
  _event: TokensUnstaked;

  constructor(event: TokensUnstaked) {
    this._event = event;
  }

  get staker(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get time(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get remaining(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class Contract__stakedDetailsResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: boolean;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt, value3: boolean) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, EthereumValue> {
    let map = new TypedMap<string, EthereumValue>();
    map.set("value0", EthereumValue.fromUnsignedBigInt(this.value0));
    map.set("value1", EthereumValue.fromUnsignedBigInt(this.value1));
    map.set("value2", EthereumValue.fromUnsignedBigInt(this.value2));
    map.set("value3", EthereumValue.fromBoolean(this.value3));
    return map;
  }
}

export class Contract extends SmartContract {
  static bind(address: Address): Contract {
    return new Contract("Contract", address);
  }

  owner(): Address {
    let result = super.call("owner", []);
    return result[0].toAddress();
  }

  stakedDetails(_staker: Address): Contract__stakedDetailsResult {
    let result = super.call("stakedDetails", [
      EthereumValue.fromAddress(_staker)
    ]);
    return new Contract__stakedDetailsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBoolean()
    );
  }

  token(): Address {
    let result = super.call("token", []);
    return result[0].toAddress();
  }
}

export class ConstructorCall extends EthereumCall {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends EthereumCall {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class StakeTokensCall extends EthereumCall {
  get inputs(): StakeTokensCall__Inputs {
    return new StakeTokensCall__Inputs(this);
  }

  get outputs(): StakeTokensCall__Outputs {
    return new StakeTokensCall__Outputs(this);
  }
}

export class StakeTokensCall__Inputs {
  _call: StakeTokensCall;

  constructor(call: StakeTokensCall) {
    this._call = call;
  }

  get _amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _duration(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class StakeTokensCall__Outputs {
  _call: StakeTokensCall;

  constructor(call: StakeTokensCall) {
    this._call = call;
  }
}

export class StakeTokensForCall extends EthereumCall {
  get inputs(): StakeTokensForCall__Inputs {
    return new StakeTokensForCall__Inputs(this);
  }

  get outputs(): StakeTokensForCall__Outputs {
    return new StakeTokensForCall__Outputs(this);
  }
}

export class StakeTokensForCall__Inputs {
  _call: StakeTokensForCall;

  constructor(call: StakeTokensForCall) {
    this._call = call;
  }

  get _staker(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _duration(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class StakeTokensForCall__Outputs {
  _call: StakeTokensForCall;

  constructor(call: StakeTokensForCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends EthereumCall {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get _newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class WithdrawTokensCall extends EthereumCall {
  get inputs(): WithdrawTokensCall__Inputs {
    return new WithdrawTokensCall__Inputs(this);
  }

  get outputs(): WithdrawTokensCall__Outputs {
    return new WithdrawTokensCall__Outputs(this);
  }
}

export class WithdrawTokensCall__Inputs {
  _call: WithdrawTokensCall;

  constructor(call: WithdrawTokensCall) {
    this._call = call;
  }

  get _amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class WithdrawTokensCall__Outputs {
  _call: WithdrawTokensCall;

  constructor(call: WithdrawTokensCall) {
    this._call = call;
  }
}
