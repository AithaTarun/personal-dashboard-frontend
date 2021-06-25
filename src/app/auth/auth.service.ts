import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {AuthData} from './auth-data';

import jwt_decode, { JwtPayload } from 'jwt-decode'

const BACKEND_URL = environment.backend_URL;

@Injectable
(
    {
      providedIn : 'root'
    }
)
export class AuthService
{
  private token: string;
  private authStatusListener = new Subject<boolean>(); // Used to push authentication information.

  private isAuthenticated = false;

  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router)
  {

  }

  createUser(username: string, password: string, email: string, dob: Date): Observable<any>
  {
    const authData: AuthData = {username, password, email, dob};

    return this.http
        .post
        (
            BACKEND_URL + '/user/signup',
            authData
        );
  }

  loginUser(username: string, password: string, remember: boolean): Observable<any>
  {
    const authData = {username, password, remember};

    return this.http
        .post
        (
            BACKEND_URL + '/user/signin',
            authData
        );
  }

  login(response)  // Called after user has successfully logged in.
  {
    this.token = response.token;
    if (this.token)
    {
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);

      this.authStatusListener.next(true);
      this.isAuthenticated = true;

      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(this.token, expirationDate);

      this.router.navigate(['/']);
    }
  }

  activateAccount(activationID: string)
  {
    return this.http.put<{message: string}>
    (
        environment.backend_URL + '/user/activateAccount',
        {
          id: activationID
        }
    );
  }

  getAuthStatusListener()
  {
    return this.authStatusListener.asObservable();
    /*
    As observable because so we can't emit new values from other components,
    we only want to be able to emit from within the service but we want to be able to listen
    from other parts.
     */
  }

  getIsAuth()
  {
    return this.isAuthenticated;
  }

  logout()
  {
    this.token = null;
    this.isAuthenticated = false;

    this.authStatusListener.next(false);

    clearTimeout(this.tokenTimer);

    this.clearAuthData();

    this.router.navigate(['/auth/login']);
  }

  private saveAuthData(token: string, expirationDate: Date)
  {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  autoAuthUser()
  {
    const authInformation = this.getAuthData();

    if (!authInformation)
    {
      return;
    }

    const now = new Date();

    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0)
    {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);

      this.authStatusListener.next(true);
    }
  }

  private getAuthData()
  {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (!token || !expirationDate)
    {
      return;
    }

    return {
      token,
      expirationDate : new Date(expirationDate),
    }
  }

  private setAuthTimer(duration: number)
  {
    this.tokenTimer = setTimeout
    (
        () =>
        {
          this.logout();
        },
        duration * 1000 // Seconds -> Milliseconds.
    );
  }

  public getToken()
  {
    return this.token;
  }

  // public getLoggedInUserName()
  // {
  //   return jwt_decode<JwtPayload>(this.token).username;
  // }
  //
  // public getLoggedInId()
  // {
  //   return jwt_decode<JwtPayload>(this.token).userId;
  // }

}
