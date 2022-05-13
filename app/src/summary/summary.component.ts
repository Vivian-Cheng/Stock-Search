import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as Highcharts from "highcharts/highstock";
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
NoDataToDisplay(Highcharts);

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  @Input() ticker = '';
  @Input() compDescript: any = [];
  @Input() compQuote: any;
  @Input() compPeer: any;
  @Input() compCandle: any = [];

  isHighcharts = typeof Highcharts === 'object';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};


  constructor() {
  }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.compCandle && changes['compCandle']) {
      this.setChart();
    }
  }
  setChart() {
    let dataList: any = [];
    if (this.compCandle.s == 'ok') {
      for (let i = 0; i < this.compCandle.t.length; i++) {
        dataList.push([this.compCandle.t[i] * 1000, this.compCandle.c[i]]);
      }
    }
    this.Highcharts.setOptions({
      lang: {
        noData: 'No data to display'
      }
    });
    this.chartOptions =
    {
      title: {
        text: this.compDescript.ticker! + " Hourly Price Variation"
      },
      xAxis: {
        type: 'datetime',
        labels: {
          format: '{value: %H:%M}'
        },
        title: {
          text: null
        },
        scrollbar: {
          enabled: true
        },
        crosshair: true
      },
      yAxis: {
        labels: {
          align: 'left',
          x: -15,
          y: -2
        },
        title: {
          text: null
        },
        opposite: true
      },
      series: [{
        type: 'line',
        name: this.compDescript.ticker!,
        data: dataList,
        color: this.compQuote.d == 0 ? '#000000' : (this.compQuote.d > 0 ? '#53A451' : '#E9392B'),
        tooltip: {
          valueDecimals: 2
        },
        showInLegend: false
      }],
      time: {
        timezoneOffset: new Date().getTimezoneOffset()
      },
      tooltip: {
        split: true
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          }
        }]
      }
    }
  }
}
