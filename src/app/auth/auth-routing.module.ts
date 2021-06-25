import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SignupComponent} from './signup/signup.component';
import {AccountActivationComponent} from './account-activation/account-activation.component';
import {SigninComponent} from './signin/signin.component';


const routes: Routes =
    [
        {
            path : 'register',
            component : SignupComponent
        },

        {
            path : 'activateAccount/:id',
            component : AccountActivationComponent
        },

        {
            path: 'login',
            component: SigninComponent
        }
    ];

@NgModule
(
    {
        imports :
            [
                RouterModule.forChild(routes)
            ],
        exports :
            [
                RouterModule
            ]
    }
)
export class AuthRoutingModule
{

}
