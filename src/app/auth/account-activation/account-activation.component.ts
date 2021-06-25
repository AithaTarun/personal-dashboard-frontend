import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {InfoComponent} from '../../info/info.component';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component
(
    {
      selector: 'app-activate-account',
      templateUrl: './account-activation.component.html',
      styleUrls: ['./account-activation.component.scss']
    }
)
export class AccountActivationComponent implements OnInit
{
  public message: string;

    constructor
  (
      private authService: AuthService,
      private route: ActivatedRoute,
      private router: Router,
      private modalService: NgbModal)
  {

  }

  ngOnInit()
  {
    this.route.paramMap.subscribe
    (
        (paramMap: ParamMap) =>
        {
          this.authService.activateAccount(paramMap.get('id'))
              .pipe
              (
                  catchError
                  (
                      (error: any) =>
                      {
                          const errorMessage: string = error.error.message

                          const modalReference = this.modalService.open
                          (
                              InfoComponent
                          );
                          modalReference.componentInstance.headerText = 'Account Activation'
                          modalReference.componentInstance.content = 'Invalid activation ID';
                          modalReference.componentInstance.type = 'error';

                          this.router.navigate(['/']);

                          return throwError('Error occurred');
                      }
                  )
              )
              .subscribe
              (
                  (result) =>
                  {
                    this.message = result.message;

                    const modalReference = this.modalService.open
                    (
                        InfoComponent
                    );
                    modalReference.componentInstance.headerText = 'Account Activation'
                    modalReference.componentInstance.content = this.message;
                    modalReference.componentInstance.type = 'message';

                      this.router.navigate(['/']);
                  }
              );
        }
    )
  }
}
