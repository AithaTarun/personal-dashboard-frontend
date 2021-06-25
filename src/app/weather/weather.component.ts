import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {WeatherService} from './weather.service';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {catchError, debounce, distinctUntilChanged, map} from 'rxjs/operators';
import {EMPTY, Observable, throwError, timer} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

import {capitalize} from '@ngrx/store/schematics-core/utility/strings';

import moment from 'moment';
import momentTimezone from 'moment-timezone'

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  encapsulation: ViewEncapsulation.None  // Without ViewEncapsulation.None, the styles applied in this component will only effect this component and not any other component on this page.
})
export class WeatherComponent implements OnInit
{
  public userPosition = null;

  public locationData;
  public weatherData;

  public searchData: {locationName: string; weatherData: any }[] = [];
  public typeAheads: {locationName: string, weatherConditionIcon: string, temperature: number, description: string}[] = [];

  public form: FormGroup;

  public momentFunction = moment;
  public momentTimezoneFunction = momentTimezone;

  private isLatest = false;
  private isCurrentLocationEntered = false;

  formatter = (x) =>
  {
      return x.locationName;
  };  // To change value of input box after selecting option from typeahead.

  constructor(private weatherService: WeatherService, public authService: AuthService, private http: HttpClient,
              private toastrService: ToastrService,  private router: Router)
  {

  }

  ngOnInit()
  {
      if (!this.authService.getIsAuth())
      {
          return this.router.navigate(['pages', 'unauthorized']);
      }

      this.form = new FormGroup
      (
          {
              'location': new FormControl
              (
                  '',
                  {
                      validators :
                          [
                              Validators.required,
                          ]
                  }
              )
          }
      );

      this.form.get('location').valueChanges.subscribe
      (
          (value) =>
          {
              this.isLatest = false;

              if (value === '' || this.isCurrentLocationEntered)
              {
                  this.typeAheads = [];
                  this.isCurrentLocationEntered = false;

                  return;
              }

              if (typeof value === 'object')
              {
                  this.form.get('location').setValue(value.locationName);
              }

             this.weatherService.getLocationsData(this.form.get('location').value)
                  .pipe
                  (
                      catchError
                      (
                          (error: any) =>
                          {
                              console.log(error);

                              const errorMessage: string = error.error.message;

                              this.toastrService.error(errorMessage, 'Location error', {tapToDismiss: true, timeOut: 2000})

                              return throwError('Location error');
                          }
                      )
                  )
                  .subscribe
                  (
                      (responseData: {locationWeatherData: {locationName: string, weatherData: any, temperature: number, description: string}[]}) =>
                      {
                          this.searchData = responseData.locationWeatherData;

                          this.typeAheads = [];

                          this.searchData.forEach
                          (
                              (loc) =>
                              {
                                  this.typeAheads.push(
                                      {
                                          locationName: loc.locationName,
                                          weatherConditionIcon: 'assets/img/ico/weather/conditions/' + loc.weatherData.current.weather[0].icon + '.png',
                                          temperature: loc.weatherData.current.temp,
                                          description: capitalize(loc.weatherData.current.weather[0].description)
                                      })
                              }
                          );
                          this.isLatest = true;
                      }
                  );
          }
      );

      this.fetchCurrentLocationWeather();
  }

    fetchCurrentLocationWeather()
    {
      navigator.geolocation.getCurrentPosition
      (
          (loc) =>
          {
              this.userPosition = loc;

              this.weatherService.getDataFromCoordinates(this.userPosition.coords.latitude, this.userPosition.coords.longitude)
                  .pipe
                  (
                      catchError
                      (
                          (error: any) =>
                          {
                              console.log(error);

                              const errorMessage: string = error.error.message;

                              this.toastrService.error(errorMessage, 'Weather Error', {tapToDismiss: true, timeOut: 2000})

                              return throwError('Weather error');
                          }
                      )
                  )
                  .subscribe
                  (
                      (responseData: {weatherData: any, locationData: any}) =>
                      {
                          this.locationData = responseData.locationData;
                          this.weatherData = responseData.weatherData;

                          this.weatherService.getWeatherDataSubject().next(responseData.weatherData);

                          this.isCurrentLocationEntered = true;
                          this.form.get('location').setValue(responseData.locationData.features[0].place_name);
                      }
                  )
          },
          (error) =>
          {
              console.log(error);

              this.toastrService.error('Please accept the location permission / enter your location to fetch weather forecast', 'Location error', {tapToDismiss: true, timeOut: 4000})
          }
      );
  }

  onLocationEntered()
  {
     this.weatherService.getData(this.form.get('location').value)
        .pipe
        (
            catchError
            (
                (error: any) =>
                {
                    console.log(error);

                    const errorMessage: string = error.error.message;

                    this.toastrService.error(errorMessage, 'Weather Error', {tapToDismiss: true, timeOut: 2000})

                    return throwError('Weather error');
                }
            )
        )
        .subscribe
        (
            (responseData: {weatherData: any, locationData: any}) =>
            {
                this.locationData = responseData.locationData;
                this.weatherData = responseData.weatherData;

                this.weatherService.getWeatherDataSubject().next(this.weatherData);
            }
        )
    }

    // @ts-ignore
    getTypeahead(): (text: Observable<string>) => Observable<{locationName: string; weatherConditionIcon: string}[]>
    {
        this.isLatest = false;

        return (text: Observable<string>) =>
            text
                .pipe
                (
                    debounce(e => this.isLatest ? EMPTY : timer(500)),  // Wait until latest typeahead are updated from http request.
                    distinctUntilChanged(),
                    map
                    (
                        term => this.typeAheads
                    )
                );
    }
}
