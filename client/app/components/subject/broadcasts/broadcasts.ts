import {Component, EventEmitter, Output, Input} from 'angular2/core';
import {Broadcast} from '../../../interfaces/subject';
import {BroadcastDetailComponent} from './broadcast/broadcast';
import {BroadcastService} from '../../../services/broadcast.service';

@Component({
  selector: 'broadcasts',
  template: `
  <h2>Broadcasts</h2>
  <button (click)="broadcast()">Knapp</button>
  <ul *ngFor="#broadcast of broadcasts">
    <li> <broadcast [broadcast]="broadcast"></broadcast></li>
  </ul>
  `,
  directives: [BroadcastDetailComponent]
})

export class BroadcastComponent {

  @Input() broadcasts: Broadcast[];

  @Output() updateBroadcast = new EventEmitter();

  constructor(private broadcastService: BroadcastService) {}


  broadcast() {
    this.updateBroadcast.emit('event');
  }
}
