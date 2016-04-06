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
  error: boolean = false;
  auth: AuthService;

  constructor(fb: FormBuilder, @Inject(AuthService) auth: AuthService, public router: Router) {
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



  onSubmit(value: any) {
    this.auth.authenticate(value.username, value.password)
    .then((authenticated: boolean) => {
      if (authenticated) {
          this.router.navigate(['MainPath']);
        }
      }).catch((err) => {
        console.log(err);
        this.error = true;
      });
  }
}
