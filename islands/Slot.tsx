import { Signal, useSignal } from "@preact/signals";

export class ServerSlot {
  #state!: number;
  #key!: number;

  constructor(move: number) {
    this.info = move;
  }
  get isOccupied() {
    return this.#state != 0;
  }
  get playerID() {
    if (this.#state == 0 || this.#state == 7) return 0;
    else return this.#state;
  }
  set info(move: number) {
    this.#key = move & 31;
    this.#state = (move & 224) >> 5;
  }
  get info() {
    return this.#state << 5 | this.#key;
  }
  get state() {
    return this.#state;
  }
  set state(state: number) {
    this.#state = state;
  }
  get key() {
    return this.#key;
  }
  set key(key: number) {
    this.#key = key;
  }
  toString() {
    return `${this.info.toString(16)}`;
  }
}

export default class Slot extends ServerSlot {
  sig: Signal<string>;
  constructor(move: number) {
    super(move);
    this.sig = useSignal("#B58B59");
  }
}
