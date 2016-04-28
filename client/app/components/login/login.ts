import {Component, Inject} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup, NgIf} from 'angular2/common';
import {Router, CanActivate} from 'angular2/router';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'login',
  templateUrl: 'app/components/login/login.html',
  directives: [FORM_DIRECTIVES, NgIf],
})

export class LoginComponent {

  form: ControlGroup;
  pane: string;
  error: string;
  message: string;

  constructor(fb: FormBuilder, private auth: AuthService, public router: Router) {
    this.auth = auth;
    this.form = fb.group({
      username:  ['', Validators.required],
      password:  ['', Validators.required]
    });


    this.auth.authenticated$.subscribe((authenticated) => {
      if (authenticated) {
        this.router.navigate(['MainPath']);
      }
    });
  }


  /** Login */
  onSubmit(value: any) {
    this.auth.authenticate(value.username, value.password)
    .then((authenticated: boolean) => {
      if (authenticated) {
          this.router.navigate(['MainPath']);
        }
      }).catch((err) => {
        this.error = err.json().message;
        this.message = undefined;
      });
  }


  forgotPassword(email) {

    this.auth.forgotPassword(email).subscribe(res => {
      this.message = res.message;
      this.pane = undefined;
    }, err => {
      this.message = err.json().message;
    });

  }
}
