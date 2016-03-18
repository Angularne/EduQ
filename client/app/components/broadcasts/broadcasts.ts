import {Component, EventEmitter, Output} from 'angular2/core';
import {Broadcast} from '../../interfaces/broadcast';
import {BroadcastDetailComponent} from '../broadcast/broadcast';

@Component({
  selector: 'broadcasts',
  template: `
  <button (click)="broadcast()">Knapp</button>
  <ul *ngFor="#broadcast of broadcasts">
    <li> <broadcast [broadcast]="broadcast"></broadcast></li>
  </ul>
  `,
  inputs: ['broadcasts'],
  directives: [BroadcastDetailComponent]
})

export class BroadcastComponent {
  constructor() {}
  @Output() updateBroadcast = new EventEmitter();
  broadcast() {
    this.updateBroadcast.emit('event');
  }
}
