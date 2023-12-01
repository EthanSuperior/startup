import { Signal, useSignal } from "@preact/signals";

class Slot {
  #state!: number;
  key!: number;
  sig: Signal<string>;

  constructor(move: number) {
    this.info = move;
    this.sig = useSignal("#000000");
  }
  get isOccupied() {
    return this.#state != 0;
  }
  get playerID() {
    if (this.#state == 0 || this.#state == 7) return 0;
    else return this.#state;
  }
  set info(move: number) {
    this.key = move & 31;
    this.#state = (move & 224) >> 5;
  }
  get info() {
    return this.#state << 5 | this.key;
  }
  get state() {
    return this.#state;
  }
  set state(state: number) {
    this.#state = state;
  }
}
export default Slot;
