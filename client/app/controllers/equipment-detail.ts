import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Equipment} from '../services/equipment/equipment';

@Component({
  selector: 'equipment-detail',
  template: `
  <span (click)="toggleCollapse()"><span class="badge" >{{equipment.id}}</span> {{equipment.name}} </span><button (click)="deleteButton(gear)">X</button>
<div *ngIf="!collapsed">
<ul>
  <li>Count: {{equipment.count}}</li>
  </ul>
</div>
  `
})
export class EquipmentDetailComponent{
  public collapsed:boolean = true;
  @Input() equipment: Equipment;
  @Output() deleteEquipment = new EventEmitter<Equipment>();

  toggleCollapse(){
    this.collapsed = !this.collapsed;
  }
  deleteButton(equipment: Equipment) {
    this.deleteEquipment.emit(equipment);
  }
}
