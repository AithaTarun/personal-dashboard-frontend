import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit
{

  form: FormGroup;

  usernameError = '';
  passwordError = '';

  constructor(private authService: AuthService, private router: Router)
  {

  }

  ngOnInit()
  {
    this.form = new FormGroup
    (
        {
          // Username
          'username' : new FormControl
          (
              '',
              {
                validators :
                    [
                      Validators.required,
                      Validators.minLength(5)
                    ]
              }
          ),

          // Password
          'password' : new FormControl
          (
              '',
              {
                validators :
                    [
                      Validators.required,
                      Validators.minLength(6)
                    ]
              }
          ),

         // Remember me
          'remember': new FormControl
          (
              false
          )
    }
    );
  }

  onFormChange()
  {
      if (this.form.get('username') && this.form.get('username').hasError('incorrect'))
      {
          this.form.get('username').setErrors(null);
      }

      if (this.form.get('password').hasError('incorrect'))
      {
          this.form.get('password').setErrors(null);
      }

      // Username validation
      if (this.form.get('username').value.length === 0)
      {
          this.usernameError = 'Required field'
      }
      else if (this.form.get('username').value.length < 5)
      {
          this.usernameError = 'Username should be minimum of 5 characters';
      }
      else
      {
          this.usernameError = '';
      }

      // Password validation
      if (this.form.get('password').value.length === 0)
      {
          this.passwordError = 'Required field';
      }
      else if (this.form.get('password').value.length < 6)
      {
          this.passwordError = 'Password should be minimum of 6 characters';
      }
      else
      {
          this.passwordError = '';
      }
  }

  onLogin()
  {
      const loginUserObservable: Observable<any> = this.authService.loginUser(
          this.form.get('username').value,
          this.form.get('password').value,
          this.form.get('remember').value
      );

      loginUserObservable
          .pipe
          (
              catchError
              (
                  (error: any) =>
                  {
                      const errorMessage: string = error.error.message;

                      // tslint:disable-next-line:quotemark
                      if (errorMessage === "Username doesn't exits")
                      {
                          this.usernameError = errorMessage;
                          this.form.get('username').setErrors({'incorrect': true});
                      }
                      else if (errorMessage === 'User not yet verified')
                      {
                          this.usernameError = errorMessage;
                          this.form.get('username').setErrors({'incorrect': true});
                      }
                      else if (errorMessage === 'Wrong username and password combination')
                      {
                          this.passwordError = errorMessage;
                          this.form.get('password').setErrors({'incorrect': true});
                      }

                      return throwError('Authentication failed');
                  }
              )
          )
          .subscribe
          (
              (response) =>
              {
                  this.authService.login(response);
              }
          );
  }

}
