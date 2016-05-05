import {Component, Output, EventEmitter} from "@angular/core";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: "change-password",
  templateUrl: "app/components/me/password/password.html"
})
export class ChangePasswordComponent {

  message: string;

  currentPassword: string = "";
  newPassword: string = "";
  confirmPassword: string = "";

  @Output() saved: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() canceled: EventEmitter<any> = new EventEmitter<any>();

  constructor(private auth: AuthService) { }


  validate() {
    if (!this.currentPassword) {
      this.message = "Current password is not set";
      return false;
    }

    if (this.newPassword.length < 8) {
      this.message = "Password must be at least 8 characters long";
      return false;
    }

    let re = /[0-9]/;
    if (!re.test(this.newPassword)) {
      this.message = "Password must contain at least one number (0-9)!";
      return false;
    }
    re = /[a-z]/;
    if (!re.test(this.newPassword)) {
      this.message = "Password must contain at least one lowercase letter (a-z)!";
      return false;
    }
    re = /[A-Z]/;
    if (!re.test(this.newPassword)) {
      this.message = "Password must contain at least one uppercase letter (A-Z)!";
      return false;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = "Confirm password does not match";
      return false;
    }

    return true;
  }

  save() {
    if (this.validate()) {
      this.auth.changePassword(this.currentPassword, this.newPassword).subscribe(res => {
        if (res) {
        this.auth.getUser().then(user => {
             this.auth.authenticate(user.email, this.newPassword).then(authenticated => {
               if (authenticated) {
                 this.saved.emit(true);
               }
             });
           });
        } else {
          this.message = "Wrong password";
        }
      }, err => {
        this.message = "Wrong password";
      });
    }
    }

  cancel() {
    this.canceled.emit(null);
  }
}
