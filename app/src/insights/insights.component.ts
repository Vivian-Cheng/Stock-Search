import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '../app/api.service';
import * as Highcharts from "highcharts/highstock";
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
NoDataToDisplay(Highcharts);

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {

  @Input() ticker = '';
  @Input() compName = '';
  redditData = { "total": 0, "pos": 0, "neg": 0 };
  twitterData = { "total": 0, "pos": 0, "neg": 0 };
  compRecomm: any = [];
  compEarning: any = [];
  constructor(private api: ApiService) { }

  isRecommHighcharts = typeof Highcharts === 'object';
  recommHighcharts: typeof Highcharts = Highcharts;
  recommChartOptions: Highcharts.Options = {};

  isEarnHighcharts = typeof Highcharts === 'object';
  earnHighcharts: typeof Highcharts = Highcharts;
  earnChartOptions: Highcharts.Options = {};

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ticker'])
      this.run();
  }

  run() {
    this.api.getSentiment(this.ticker).subscribe((data => {
      this.redditData = { "total": 0, "pos": 0, "neg": 0 };
      if (data.reddit && data.reddit.length != 0) {
        data.reddit!.forEach((element: any) => {
          this.redditData.total += element.mention;
          this.redditData.pos += element.positiveMention;
          this.redditData.neg += element.negativeMention;
        });
      }
      if (data.twitter && data.twitter.length != 0) {
        this.twitterData = { "total": 0, "pos": 0, "neg": 0 };
        data.twitter!.forEach((element: any) => {
          this.twitterData.total += element.mention;
          this.twitterData.pos += element.positiveMention;
          this.twitterData.neg += element.negativeMention;

        });
      }

    }))
    this.api.getRecommendation(this.ticker).subscribe((data => {
      this.compRecomm = data;
      this.setRecommChart();
    }))
    this.api.getEarnings(this.ticker).subscribe((data => {
      if (data.length != 0 && !data.error) {
        data.forEach((item: any) => {
          Object.keys(item).forEach((key: any) => {
            if (item[key] === null)
              item[key] = 0;
          })
        });
        this.compEarning = data;
        this.setEarnChart();
      }

    }))
  }

  setRecommChart() {
    let xTime: any = [];
    let yData: any[] = [[], [], [], [], []];
    if (!this.compRecomm.error) {
      this.compRecomm.forEach((element: any) => {
        xTime.push(element.period);
        yData[0].push(element.strongBuy);
        yData[1].push(element.buy);
        yData[2].push(element.hold);
        yData[3].push(element.sell);
        yData[4].push(element.strongSell);
      });
    }
    this.recommHighcharts.setOptions({
      lang: {
        noData: 'No data to display'
      }
    });
    this.recommChartOptions = {

      title: {
        text: 'Recommendation Trends'
      },
      xAxis: {
        categories: xTime
      },
      yAxis: {
        min: 0,
        title: {
          text: '#Analysis',
          align: 'high'
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      series: [{
        name: 'Strong Buy',
        type: 'column',
        data: yData[0],
        color: '#346C3D'
      }, {
        name: 'Buy',
        type: 'column',
        data: yData[1],
        color: '#57B660'
      }, {
        name: 'Hold',
        type: 'column',
        data: yData[2],
        color: '#B38D37'
      }, {
        name: 'Sell',
        type: 'column',
        data: yData[3],
        color: '#E26660'
      }, {
        name: 'Strong Sell',
        type: 'column',
        data: yData[4],
        color: '#773634'
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
        }]
      }
    }
  }

  setEarnChart() {
    let actData: any = [];
    let estData: any = [];
    let xData: any = [];
    this.compEarning.forEach((element: any) => {
      let xFormat = element.period + "<br>Surprise: " + element.surprise;
      xData.push(xFormat);
      actData.push([xFormat, element.actual]);
      estData.push([xFormat, element.estimate]);
    });
    this.earnHighcharts.setOptions({
      lang: {
        noData: 'No data to display'
      }
    });
    this.earnChartOptions = {
      title: {
        text: 'Historical EPS Surprises'
      },
      xAxis: {
        categories: xData
      },
      yAxis: {
        title: {
          text: 'Quarterly EPS'
        },
        lineWidth: 2
      },
      legend: {
        enabled: true
      },
      tooltip: {
        shared: true,
        valueDecimals: 2
      },
      series: [{
        name: 'Actual',
        type: 'spline',
        data: actData
      }, {
        name: 'Estimate',
        type: 'spline',
        data: estData
      }]
    }

  }
}
