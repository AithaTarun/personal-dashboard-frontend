import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {AuthService} from './auth/auth.service';

@Component
({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy
{
    subscription: Subscription;

    constructor(private router: Router, private authService: AuthService)
    {

    }

    ngOnInit()
    {
        this.subscription = this.router.events
            .pipe
            (
                filter(event => event instanceof NavigationEnd)
            )
            .subscribe(() => window.scrollTo(0, 0));

        this.authService.autoAuthUser();
    }


    ngOnDestroy() {
        if (this.subscription)
        {
            this.subscription.unsubscribe();
        }
    }
}
