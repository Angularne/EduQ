import {Component, EventEmitter, Output} from 'angular2/core';
import {Broadcast} from '../../interfaces/subject';
import {BroadcastDetailComponent} from '../broadcast/broadcast';
import {SubjectService} from '../../services/subject';

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
  broadcasts: Broadcast[];
  constructor(public subjectService: SubjectService) {
    this.subjectService.broadcasts.subscribe((value) => {
      this.broadcasts = value;
    })
  }
  @Output() updateBroadcast = new EventEmitter();
  broadcast() {
    this.updateBroadcast.emit('event');
  }
}
