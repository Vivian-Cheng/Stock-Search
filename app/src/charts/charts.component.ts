import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '../app/api.service';
import * as Highcharts from "highcharts/highstock";
import IndicatorsCore from "highcharts/indicators/indicators";
import exporting from 'highcharts/indicators/volume-by-price';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';

IndicatorsCore(Highcharts);
exporting(Highcharts)
NoDataToDisplay(Highcharts);

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  @Input() ticker = '';
  compCandle: any = [];

  constructor(private api: ApiService) { }

  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ticker'])
      this.run();
  }

  run() {
    let today = new Date();
    let to: string = Math.floor(Date.now() / 1000).toString();
    let from = Math.floor(today.setFullYear(today.getFullYear() - 2) / 1000).toString();
    this.api.getCandle(this.ticker, "D", from, to).subscribe(data => {
      this.compCandle = data;
      //console.log("charts");
      //console.log(data);
      this.setChart();
    })
  }

  setChart() {
    let ohlc: any = [];
    let volume: any = [];
    let groupingUnits: any = [[
      'week',             // unit name
      [1]               // allowed multiples
    ], [
      'month',
      [1, 2, 3, 4, 6]
    ]];
    // check for valid company candle data
    if (this.compCandle.s == 'ok') {
      for (let i = 0; i < this.compCandle.t.length; i++) {
        ohlc.push([this.compCandle.t[i] * 1000, this.compCandle.o[i], this.compCandle.h[i], this.compCandle.l[i], this.compCandle.c[i]]);
        volume.push([this.compCandle.t[i] * 1000, this.compCandle.v[i]]);
      }
    }

    this.Highcharts.setOptions({
      lang: {
        noData: 'No data to display',
        rangeSelectorFrom: 'From',
        rangeSelectorTo: 'To'
      }
    });
    Highcharts.stockChart('container', {
      rangeSelector: {
        enabled: true,
        allButtonsEnabled: true,
        buttons: [
          {
            type: 'month',
            count: 1,
            text: '1m',
          },
          {
            type: 'month',
            count: 3,
            text: '3m',
          },
          {
            type: 'month',
            count: 6,
            text: '6m',
          },
          {
            type: 'ytd',
            text: 'YTD',
          },
          {
            type: 'year',
            count: 1,
            text: '1y',
          },
          {
            type: 'all',
            text: 'All',
          },
        ],
        selected: 2,
        dropdown: 'never',
        inputBoxBorderColor: 'gray',
        inputBoxWidth: 120,
        inputBoxHeight: 18,
        inputStyle: {
          color: 'gray',
        },
        labelStyle: {
          color: 'silver',
          fontWeight: 'bold'
        },

      },

      title: {
        text: this.ticker + ' Historical'
      },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },
      xAxis: [{
        type: 'datetime',
        labels: {
          format: '{value: %e. %b}'
        }
      }],
      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true,
        valueDecimals: 2
      },

      plotOptions: {
        series: {
          dataGrouping: {
            units: groupingUnits
          }
        }
      },

      series: [{
        type: 'candlestick',
        name: this.ticker,
        id: 'candle',
        zIndex: 2,
        data: ohlc
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: volume,
        yAxis: 1
      }, {
        type: 'vbp',
        linkedTo: 'candle',
        params: {
          volumeSeriesID: 'volume'
        },
        dataLabels: {
          enabled: false
        },
        zoneLines: {
          enabled: false
        }
      }, {
        type: 'sma',
        linkedTo: 'candle',
        zIndex: 1,
        marker: {
          enabled: false
        }
      }]
    })
  }

}
