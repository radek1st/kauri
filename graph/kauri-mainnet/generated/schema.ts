import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class OwnershipRenounced extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save OwnershipRenounced entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save OwnershipRenounced entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("OwnershipRenounced", id.toString(), this);
  }

  static load(id: string): OwnershipRenounced | null {
    return store.get("OwnershipRenounced", id) as OwnershipRenounced | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get previousOwner(): Bytes {
    let value = this.get("previousOwner");
    return value.toBytes();
  }

  set previousOwner(value: Bytes) {
    this.set("previousOwner", Value.fromBytes(value));
  }
}

export class OwnershipTransferred extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id !== null,
      "Cannot save OwnershipTransferred entity without an ID"
    );
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save OwnershipTransferred entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("OwnershipTransferred", id.toString(), this);
  }

  static load(id: string): OwnershipTransferred | null {
    return store.get("OwnershipTransferred", id) as OwnershipTransferred | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get previousOwner(): Bytes {
    let value = this.get("previousOwner");
    return value.toBytes();
  }

  set previousOwner(value: Bytes) {
    this.set("previousOwner", Value.fromBytes(value));
  }

  get newOwner(): Bytes {
    let value = this.get("newOwner");
    return value.toBytes();
  }

  set newOwner(value: Bytes) {
    this.set("newOwner", Value.fromBytes(value));
  }
}

export class TokensStaked extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save TokensStaked entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save TokensStaked entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("TokensStaked", id.toString(), this);
  }

  static load(id: string): TokensStaked | null {
    return store.get("TokensStaked", id) as TokensStaked | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get stakedBy(): Bytes {
    let value = this.get("stakedBy");
    return value.toBytes();
  }

  set stakedBy(value: Bytes) {
    this.set("stakedBy", Value.fromBytes(value));
  }

  get stakedFor(): Bytes {
    let value = this.get("stakedFor");
    return value.toBytes();
  }

  set stakedFor(value: Bytes) {
    this.set("stakedFor", Value.fromBytes(value));
  }

  get time(): BigInt {
    let value = this.get("time");
    return value.toBigInt();
  }

  set time(value: BigInt) {
    this.set("time", Value.fromBigInt(value));
  }

  get duration(): BigInt {
    let value = this.get("duration");
    return value.toBigInt();
  }

  set duration(value: BigInt) {
    this.set("duration", Value.fromBigInt(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }
}

export class TokensUnstaked extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save TokensUnstaked entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save TokensUnstaked entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("TokensUnstaked", id.toString(), this);
  }

  static load(id: string): TokensUnstaked | null {
    return store.get("TokensUnstaked", id) as TokensUnstaked | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get staker(): Bytes {
    let value = this.get("staker");
    return value.toBytes();
  }

  set staker(value: Bytes) {
    this.set("staker", Value.fromBytes(value));
  }

  get time(): BigInt {
    let value = this.get("time");
    return value.toBigInt();
  }

  set time(value: BigInt) {
    this.set("time", Value.fromBigInt(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get remaining(): BigInt {
    let value = this.get("remaining");
    return value.toBigInt();
  }

  set remaining(value: BigInt) {
    this.set("remaining", Value.fromBigInt(value));
  }
}
