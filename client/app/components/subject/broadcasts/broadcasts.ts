import {Component, EventEmitter, Output, Input} from '@angular/core';
import {Broadcast} from '../../../interfaces/subject';
import {BroadcastDetailComponent} from './broadcast/broadcast';
import {BroadcastService} from '../../../services/broadcast.service';
import {ReversePipe} from '../../../common/reverse';

@Component({
  selector: 'broadcasts',
  template: `
  <h2>Broadcasts</h2>
  <form *ngIf="role == 'Teacher' || role == 'Assistent'">
    <input [(ngModel)]="title" placeholder="Title">
    <input [(ngModel)]="content" placeholder="Content">
    <button type="submit" (click)="createBroadcast(title, content)">Post</button>
  </form>
  <hr>
  <broadcast *ngFor="let broadcast of broadcasts | reverse" [broadcast]="broadcast" (delete)="deleteBroadcast($event)" [role]="role"></broadcast>
  `,
  directives: [BroadcastDetailComponent],
  pipes: [ReversePipe]
})

export class BroadcastComponent {

  @Input() broadcasts: Broadcast[];
  @Input() role: string;

  constructor(private broadcastService: BroadcastService) {}


  createBroadcast(title, content) {
    this.broadcastService.createBroadcast({title: title, content: content}).subscribe();
  }

  updateBroadcast(broadcast: Broadcast) {

  }

  deleteBroadcast(broadcast: Broadcast) {
    this.broadcastService.deleteBroadcast(broadcast._id).subscribe();
  }
}
