import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Broadcast} from "../../../../interfaces/subject";

@Component({
  selector: "broadcast",
  templateUrl: "app/components/subject/broadcasts/broadcast/broadcast.html"
})

export class BroadcastDetailComponent {
  @Input() broadcast: Broadcast;
  @Input() role: string;
  @Output() delete: EventEmitter<Broadcast> = new EventEmitter<Broadcast>();
}
