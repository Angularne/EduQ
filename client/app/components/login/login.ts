import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup, NgIf} from 'angular2/common';
import {Router} from 'angular2/router';
import {Authentication} from './authentication';

@Component({
  selector: 'login',
  templateUrl: 'app/components/login/login.html',
  directives: [FORM_DIRECTIVES, NgIf],
})

export class LoginComponent {
  form: ControlGroup;
  error: boolean = false;
  constructor(fb: FormBuilder, public auth: Authentication, public router: Router) {
    this.form = fb.group({
      username:  ['', Validators.required],
      password:  ['', Validators.required]
    });
  }

  onSubmit(value: any) {
    this.auth.login(value.username, value.password)
      .subscribe(
        (token: any) => this.router.navigate(['MainPath']),
        () => { this.error = true; }
      );
  }
}
