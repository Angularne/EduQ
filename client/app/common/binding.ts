export class Binding<T> {
  private _value: T;
  private _subscribers: ((value: T) => void)[] = [];


  constructor(value: T = null) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set value(value: T) {
    let oldValue = this._value;
    this._value = value;

    if (value !== oldValue) {
      this.post();
    }
  }

  private post() {
    for (let sub of this._subscribers) {
      sub(this._value);
    }
  }

  subscribe(sub: ((value: T) => void)) {
    if (sub) {
      this._subscribers.push(sub);
      sub(this._value);
    }
  }

  // TODO - add unsubscribe! May cause errors when posting updates to destroyed components
}
