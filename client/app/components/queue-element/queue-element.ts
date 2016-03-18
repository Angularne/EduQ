import {Component, Output, EventEmitter} from 'angular2/core';

@Component({
  selector: 'queue-element',
  template: `
  {{element.timeEntered}} <span *ngFor="#user of element?.users"> - {{user.firstname}} </span> <button (click)="removeElementButton()">X</button>
  `,
  inputs: ['element']
})
export class QueueElementComponent {
  element: any;
  @Output() removeElement = new EventEmitter();
  removeElementButton() {
    this.removeElement.emit('event');
  }
}
