import {Component, OnInit, ViewChild} from '@angular/core';
import {WeatherService} from '../weather.service';

import * as ngApexchart from 'ng-apexcharts';

import moment from 'moment';
import momentTimezone from 'moment-timezone'
import {capitalize} from '@ngrx/store/schematics-core/utility/strings';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

export interface ChartOptions
{
  series: ngApexchart.ApexAxisChartSeries
  chart: ngApexchart.ApexChart;
  xAxis: ngApexchart.ApexXAxis;
  colors: string[],
  tooltip: ngApexchart.ApexTooltip,
  fill: ngApexchart.ApexFill,
  stroke: ngApexchart.ApexStroke,
  noData: ngApexchart.ApexNoData,
  yAxis: ngApexchart.ApexYAxis
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit
{
  public weatherData;

  public momentFunction = moment;

  // Hourly Chart
  @ViewChild('hourlyChart', {static: false}) hourlyChart: ngApexchart.ChartComponent;
  public hourlyChartOptions: ChartOptions;
  private hourlyData = [];

  // Daily Chart
  @ViewChild('dailyChart', {static: false}) dailyChart: ngApexchart.ChartComponent;
  public dailyChartOptions: ChartOptions;
  private dailyData = [];
  public selectedDateText;

  // Historical Chart
  timestamps = [];
  @ViewChild('historicalChart', {static: false}) historicalChart: ngApexchart.ChartComponent;
  public historicalChartOptions: ChartOptions;
  private historicalData = [];

  constructor(private weatherService: WeatherService, private toastrService: ToastrService)
  {

  }

  ngOnInit()
  {
    this.initializeHourlyChart();

    this.initializeDailyChart();

    this.initializeHistoricalChart();

    this.weatherService.getWeatherDataSubject().subscribe
    (
        (weatherData) =>
        {
          this.weatherData = weatherData;

          this.hourlyData = this.weatherData.hourly;
          this.updateHourlyChartData();

          this.dailyData = this.weatherData.daily;
          this.updateDailyChartData();

          this.timestamps = [];
          for (let i = 1; i <= 5; i++)
          {
            this.timestamps.push
            (
                moment.unix(weatherData.current.dt).utc().utcOffset(weatherData.timezone_offset).tz(weatherData.timezone).subtract(i * 86400, 'seconds')
            )
          }
          this.selectedDateText = moment(this.timestamps[0]).format('Do MMM YYYY').toString()
          this.updateHistoricalChartData(this.timestamps[0]);
        }
    );
  }

  initializeHourlyChart()
  {
    this.hourlyChartOptions =  {
      series: [],
      chart: {
        height: 400,
        type: 'line',

        animations: {
          enabled: true,
          easing: 'easeout',

          animateGradually: {
            enabled: true
          },

          dynamicAnimation: {
            enabled: true
          },

        },

      },

      stroke: {
        curve: 'straight'
      },

      colors: ['#6DE0FA'],

      xAxis: {},

      tooltip: {
        enabled: true,
        custom: (data) =>
        {
          const hoveredData = this.hourlyData[data.dataPointIndex];

          const temperature = hoveredData.temp;
          const description = hoveredData.weather[0].description;
          const iconPath = `assets/img/ico/weather/conditions/${hoveredData.weather[0].icon}.png`

          const tooltipTemplate = `
          <div class="font-weight-bold my-2 mx-3" style="font-family: Orbitron, serif">
                <div class="row mt-1">
                    <div class="d-flex justify-content-center align-items-center">
                        <span class="mr-2">${capitalize(description)}</span> 
                        <img src=${iconPath} style="width: 32px; height: 32px; float: right">
                    </div>
                </div>
                <div class="row mt-1">
                    <div class="d-flex justify-content-center align-items-center">
                        <p>Temperature : ${temperature} <span>&#8451;</span></p>
                    </div>
                </div>
          </div>
          `
          return tooltipTemplate;
        }
      },

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          gradientToColors: ['#FF4F4E'],
          shadeIntensity: 1,
          type: 'vertical',
          opacityFrom: 1,
          opacityTo: 1,
        }
      },

      noData: {},

      yAxis: {}
    }
  }

  updateHourlyChartData()
  {
    const xData = [];
    const series = [];

    this.hourlyData.forEach
    (
        (data) =>
        {
          xData.push(
              moment.unix(data.dt).utc().utcOffset(this.weatherData.timezone_offset).tz(this.weatherData.timezone).format('Do MMM h:mm A').toString()
          );

          series.push
          (
              data.temp
          );
        }
    );

    this.hourlyChartOptions.xAxis = {categories: xData};
    this.hourlyChartOptions.series = [{name: 'Temperatures', data: series}];
  }

  initializeDailyChart()
  {
    this.dailyChartOptions =  {
      series: [],
      chart: {
        height: 400,
        type: 'area',

        animations: {
          enabled: true,
          easing: 'easeout',

          animateGradually: {
            enabled: true
          },

          dynamicAnimation: {
            enabled: true
          },

        },

      },

      colors: ['#FF4F4E'],

      stroke: {
        curve: 'smooth'
      },

      xAxis: {},

      tooltip: {
        enabled: true,
        custom: (data) =>
        {
          const hoveredData = this.dailyData[data.dataPointIndex];

          const minimumTemperature = hoveredData.temp.min;
          const averageTemperature = ((hoveredData.temp.min + hoveredData.temp.max) / 2).toFixed(2);
          const maximumTemperature = hoveredData.temp.max;

          const description = hoveredData.weather[0].description;
          const iconPath = `assets/img/ico/weather/conditions/${hoveredData.weather[0].icon}.png`

          const tooltipTemplate = `
          <div class="font-weight-bold my-2 mx-3" style="font-family: Orbitron, serif">
                <div class="row mt-1">
                    <div class="d-flex justify-content-center align-items-center">
                        <span class="mr-2">${capitalize(description)}</span> 
                        <img src=${iconPath} style="width: 32px; height: 32px; float: right">
                    </div>
                </div>
                <div class="row mt-1">
                    <div class="d-flex justify-content-center align-items-center">
                        <p>Maximum temperature : ${maximumTemperature} <span>&#8451;</span></p>
                    </div>
                </div>
                <div class="row mt-1">
                    <div class="d-flex justify-content-center align-items-center">
                        <p>Average temperature : ${averageTemperature} <span>&#8451;</span></p>
                    </div>
                </div>
                <div class="row mt-1">
                    <div class="d-flex justify-content-center align-items-center">
                        <p>Minimum temperature : ${minimumTemperature} <span>&#8451;</span></p>
                    </div>
                </div>
          </div>
          `
          return tooltipTemplate;
        }
      },

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          gradientToColors: ['#6DE0FA'],
          shadeIntensity: 1,
          type: 'vertical',
          opacityFrom: 0.7,
          opacityTo: 0.8,
        }
      },

      noData: {},

      yAxis: {}
    }
  }

  updateDailyChartData()
  {
    const xData = [];
    const series = [];

    this.dailyData.forEach
    (
        (data) =>
        {
          xData.push(
              moment.unix(data.dt).utc().utcOffset(this.weatherData.timezone_offset).tz(this.weatherData.timezone).format('Do MMM YYYY').toString()
          );

          series.push
          (
              ((data.temp.min + data.temp.max) / 2).toFixed(2)
          );
        }
    );

    this.dailyChartOptions.xAxis = {categories: xData};
    this.dailyChartOptions.series = [{name: 'Temperatures', data: series}];
  }

  initializeHistoricalChart()
  {
    this.historicalChartOptions =  {
      series: [],
      chart: {
        height: 400,
        type: 'line',

        animations: {
          enabled: true,
          easing: 'easeout',

          animateGradually: {
            enabled: true
          },

          dynamicAnimation: {
            enabled: true
          },

        },

      },

      stroke: {
        curve: 'smooth'
      },

      colors: ['#6DE0FA'],

      xAxis: {},

      tooltip: {
        enabled: true,
        custom: (data) =>
        {
          const hoveredData = this.historicalData[data.dataPointIndex];

          const temperature = hoveredData.temp;
          const description = hoveredData.weather[0].description;
          const iconPath = `assets/img/ico/weather/conditions/${hoveredData.weather[0].icon}.png`

          const tooltipTemplate = `
          <div class="font-weight-bold my-2 mx-3" style="font-family: Orbitron, serif">
                <div class="row mt-1">
                    <div class="d-flex justify-content-center align-items-center">
                        <span class="mr-2">${capitalize(description)}</span> 
                        <img src=${iconPath} style="width: 32px; height: 32px; float: right">
                    </div>
                </div>
                <div class="row mt-1">
                    <div class="d-flex justify-content-center align-items-center">
                        <p>Temperature : ${temperature} <span>&#8451;</span></p>
                    </div>
                </div>
          </div>
          `
          return tooltipTemplate;
        }
      },

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          gradientToColors: ['#FF4F4E'],
          shadeIntensity: 1,
          type: 'vertical',
          opacityFrom: 1,
          opacityTo: 1,
        }
      },

      noData: {
        text: 'Please select a date from dropdown',
        style: {
          fontSize: '22px',
          fontFamily: 'Orbitron,serif'
        }
      },

      yAxis: {
        opposite: true
      }

    }
  }


  dateChanged(index)
  {
    this.selectedDateText = moment(this.timestamps[index]).format('Do MMM YYYY').toString()
    this.updateHistoricalChartData(this.timestamps[index])
  }

  updateHistoricalChartData(timestamp)
  {
    this.weatherService.getHistoricalData(this.weatherData.lat, this.weatherData.lon, timestamp.format('X'))
        .pipe
        (
            catchError
            (
                (error: any) =>
                {
                  console.log(error);

                  const errorMessage: string = error.error.message;

                  this.toastrService.error(errorMessage, 'Historical Weather Error', {tapToDismiss: true, timeOut: 2000})

                  return throwError('Location error');
                }
            )
        )
        .subscribe
        (
            (response: {weatherData: any}) =>
            {
              const historicalWeatherData = response.weatherData;
              this.historicalData = historicalWeatherData.hourly;

              const xData = [];
              const series = [];

              this.historicalData.forEach
              (
                  (data) =>
                  {
                    xData.push(
                        moment.unix(data.dt).utc().utcOffset(historicalWeatherData.timezone_offset).tz(historicalWeatherData.timezone).format('Do MMM h:mm A').toString()
                    );

                    series.push
                    (
                        data.temp
                    );
                  }
              );

              this.historicalChartOptions.xAxis = {categories: xData};
              this.historicalChartOptions.series = [{name: 'Temperatures', data: series}];
            }
        )
  }

}
