import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {WeatherComponent} from './weather.component';
import {WeatherRoutingModule} from './weather.routing.module';
import {NgApexchartsModule} from 'ng-apexcharts';
import { ChartsComponent } from './charts/charts.component';

@NgModule
(
    {
        declarations:
        [
            WeatherComponent,
            ChartsComponent
        ],
        imports:
            [
                CommonModule,
                ReactiveFormsModule,
                NgbModule.forRoot(),

                WeatherRoutingModule,
                NgApexchartsModule
            ]
    }
)
export class WeatherModule
{

}
