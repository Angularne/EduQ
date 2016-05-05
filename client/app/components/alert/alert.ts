import {Component, Input} from "@angular/core";

@Component({
  selector: "alert",
  templateUrl: "app/components/alert/alert.html"
})
export class AlertComponent {
  private visible: boolean;
  @Input() strong: string = "Warning";
  @Input() text: string = "Better check yourself, you're not looking too good.";
  @Input() type: string = "success";

  constructor() { }

  show() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }
}
