import {Injectable, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';

const BACKEND_URL = environment.backend_URL;

@Injectable
(
    {
        providedIn : 'root'
    }
)
export class WeatherService implements OnInit
{
    private weatherDataSubject: Subject<any> = new Subject();

    ngOnInit()
    {

    }

    constructor(private http: HttpClient)
    {

    }

    getData(location: string)
    {
        return this.http.get
        (
            BACKEND_URL + `/weather/getWeatherData/${location}`
        )
    }

    getLocationsData(location: string)
    {
        return this.http.get
        (
            BACKEND_URL + `/weather/getLocations/${location}`
        )
    }

    getDataFromCoordinates(latitude: number, longitude: number)
    {
        return this.http.get(
            BACKEND_URL + `/weather/getWeatherData/${latitude}/${longitude}`
        )
    }

    getHistoricalData(latitude: number, longitude: number, timestamp: number)
    {
        return this.http.get(
            BACKEND_URL + `/weather/getHistoricalData/${latitude}/${longitude}/${timestamp}`
        )
    }

    getWeatherDataSubject()
    {
       return this.weatherDataSubject;
    }
}
