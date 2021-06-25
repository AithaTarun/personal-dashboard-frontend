import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {DatepickerComponent} from '../components/bootstrap/datepicker/datepicker.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {SignupComponent} from './signup/signup.component';
import {AccountActivationComponent} from './account-activation/account-activation.component';
import {SigninComponent} from './signin/signin.component';
import {RouterModule} from '@angular/router';

@NgModule(
    (
        {
            declarations :
                [
                    DatepickerComponent,

                    SignupComponent,
                    AccountActivationComponent,
                    SigninComponent
                ],

            imports :
                [
                    CommonModule,
                    ReactiveFormsModule,
                    FormsModule,
                    NgbModule.forRoot(),

                    AuthRoutingModule
                ],

            entryComponents :
                [
                    // SignupComponent,
                    // SigninComponent
                ]
        }
    )
)
export class AuthModule
{

}
