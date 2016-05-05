import {Component, Input, Output, EventEmitter} from "@angular/core";


@Component({
  selector: "confirm-modal",
  templateUrl: "app/components/confirm.modal/confirm.modal.html"
})
export class ConfirmModalComponent {

  @Input() set modal(modal: ConfirmModalOptions) {
    this.title = modal.title || this.title;
    this.body = modal.body || this.body;
    this.confirmButton = modal.confirmButton || this.confirmButton;
    this.cancelButton = modal.cancelButton || this.cancelButton;
    this.confirmed = new EventEmitter<boolean>();
    if (modal.confirmed) {
      this.confirmed.subscribe(modal.confirmed);
    }
  }

  @Input() title: string = "Title";
  @Input() body: string = "Message &hellip;";

  @Input() confirmButton: string = "Confirm";
  @Input() cancelButton: string = "Decline";

  @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  confirm() {
    this.confirmed.emit(true);
  }

  cancel() {
    this.confirmed.emit(false);
  }
}

export interface ConfirmModalOptions {
  title?: string;
  body?: string;

  confirmButton?: string;
  cancelButton?: string;

  confirmed?: ((val: boolean) => void);
}
