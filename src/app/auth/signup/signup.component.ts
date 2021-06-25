import {Component, Injectable, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {InfoComponent} from '../../info/info.component';
import {Router} from '@angular/router';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string>
{

    readonly DELIMITER = '-';

    fromModel(value: string | null): NgbDateStruct | null
    {
        if (value)
        {
            const calendarDate = value.split(this.DELIMITER);
            return {
                day : parseInt(calendarDate[0], 10),
                month : parseInt(calendarDate[1], 10),
                year : parseInt(calendarDate[2], 10)
            };
        }
        return null;
    }

    toModel(calendarDate: NgbDateStruct | null): string | null {
        return calendarDate ? calendarDate.day + this.DELIMITER + calendarDate.month + this.DELIMITER + calendarDate.year : null;
    }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter
{

    readonly DELIMITER = '/';

    parse(value: string): NgbDateStruct | null
    {
        if (value) {
            const calendarDate = value.split(this.DELIMITER);
            return {
                day : parseInt(calendarDate[0], 10),
                month : parseInt(calendarDate[1], 10),
                year : parseInt(calendarDate[2], 10)
            };
        }
        return null;
    }

    format(calendarDate: NgbDateStruct | null): string
    {
        return calendarDate ? calendarDate.day + this.DELIMITER + calendarDate.month + this.DELIMITER + calendarDate.year : '';
    }
}

@Component
(
    {
      selector: 'app-signup',
      templateUrl: './signup.component.html',
      styleUrls: ['./signup.component.scss'],
      providers: [
            {provide: NgbDateAdapter, useClass: CustomAdapter},
            {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
        ]
    }
)
export class SignupComponent implements OnInit
{
    form: FormGroup;

    usernameError = '';
    passwordError = '';
    confirmPasswordError = '';
    emailError = '';
    dobError = '';

    constructor(private authService: AuthService, private modalService: NgbModal, private router: Router)
    {

    }

    yearValidator = (control: FormControl) =>
    {
        if (control.value !== null)
        {
            try
            {
                const fullDate = control.value.split('-');

                if (fullDate[2].length !== 4 || fullDate[2] > 2000)
                {
                    throw new Error('Invalid year format');
                }
            }
            catch (e)
            {
                return {
                    'Error': e.message
                }
            }
            return null;
        }
        else
        {
            return null;
        }
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

                // Confirm password
                'confirmPassword' : new FormControl
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

                // Email
                'email' : new FormControl
                (
                    '',
                    {
                        validators :
                            [
                                Validators.required,
                                Validators.email
                            ]
                    }
                ),

                // Date of birth
                'dob' : new FormControl
                (
                    null,
                    {
                        validators :
                            [
                                Validators.required,
                                this.yearValidator
                            ],
                    }
                )
            }
        );
    }

    onFormChange()
    {
        if (this.form.get('username').hasError('incorrect'))
        {
            this.form.get('username').setErrors(null);
        }

        if (this.form.get('email').hasError('incorrect'))
        {
            this.form.get('email').setErrors(null);
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

        // Confirm password validation
        if (this.form.get('confirmPassword').value.length === 0)
        {
            this.confirmPasswordError = 'Required field';
        }
        else if (this.form.get('confirmPassword').value !== this.form.get('password').value)
        {
            this.confirmPasswordError = 'Passwords are not matching';
        }
        else
        {
            this.confirmPasswordError = '';
        }

        // Email validation
        if (this.form.get('email').value.length === 0)
        {
            this.emailError = 'Required field';
        }
        else if (this.form.get('email').invalid)
        {
            this.emailError = 'Invalid email format';
        }
        else
        {
            this.emailError = '';
        }

        // Date of birth validation
        if (this.form.get('dob').value === null)
        {
            this.dobError = 'Required field';
        }
        else if (this.form.get('dob').invalid)
        {
            this.dobError = 'Invalid date format';
        }
        else
        {
            this.dobError = '';
        }
    }

    onSignup()
    {
        const fullDate = this.form.get('dob').value.split('-');
        const userDOB = new Date(fullDate[2] + '-' + fullDate[1] + '-' + fullDate[0]);

        const createUserObservable: Observable<any> = this.authService.createUser(
            this.form.get('username').value,
            this.form.get('password').value,
            this.form.get('email').value,
            userDOB
        );

        createUserObservable
            .pipe
            (
                catchError
                (
                    (error: any) =>
                    {
                        const errorMessages: string[] = error.error.message

                        errorMessages.forEach
                        (
                            (message) =>
                            {
                                if (message === 'username')
                                {
                                    this.usernameError = 'Username already taken';
                                    this.form.get('username').setErrors({'incorrect': true});
                                }

                                if (message === 'email')
                                {
                                    this.emailError = 'Email already taken';
                                    this.form.get('email').setErrors({'incorrect': true});
                                }
                            }
                        )
                        return throwError('Error occurred');
                    }
                )
            )
            .subscribe
            (
                (response: any) =>
                {
                    const modalReference = this.modalService.open
                    (
                        InfoComponent
                    );
                    modalReference.componentInstance.headerText = 'Notification';
                    modalReference.componentInstance.content = 'Account created successfully, check you mail to activate the account';
                    modalReference.componentInstance.type = 'message';

                    this.form.reset();

                    this.router.navigate(['/']);
                }
            )
    }
}
