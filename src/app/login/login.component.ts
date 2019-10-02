import { AuthenticationService } from './../_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { first } from 'rxjs/operators'



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  homeUrl: string = '/home';
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router) { 
      if(this.authenticationService.currentUser) {
        this.router.navigate(['/']);
      }
    }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if(this.registerForm.invalid) {
      return;
    }

    this.sendLoginRequest();
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  sendLoginRequest() {
      this.authenticationService.login(this.f.username.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.homeUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      )
  }

}
