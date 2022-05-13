import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService, HoldStock } from '../app/local-storage.service';
import { ApiService } from '../app/api.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NgbModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  isEmpty = false;
  portfoList: any = [];
  stockPriceMap = new Map();
  interval: any;
  _quantity: number = 0;
  wallet: number = this.localStorage.getWallet();
  transType: string = "";
  transAlertMsg = '';

  private _trans = new Subject<string>();
  @ViewChild('transAlert', { static: false }) transAlert!: NgbAlert;

  constructor(private api: ApiService, private localStorage: LocalStorageService, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.portfoList = this.localStorage.getAllPortfo();
    this.isEmpty = this.portfoList.length == 0;
    this.wallet = this.localStorage.getWallet();
    this.run();

    this.interval = setInterval(() => {
      if (this.router.url == '/portfolio')
        this.run();
    }, 15000);

    this._trans.subscribe(message => this.transAlertMsg = message);
    this._trans.pipe(debounceTime(5000)).subscribe(() => {
      if (this.transAlert) {
        this.transAlert.close();
      }
    });
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  run() {
    this.portfoList = this.localStorage.getAllPortfo();
    this.portfoList.forEach((element: any) => {
      this.api.getQuote(element.content.ticker).subscribe(data => {
        let price = data.c == null ? 0 : data.c;
        this.stockPriceMap.set(element.content.ticker, price);
      })
    });
  }

  // linkToSearch(ticker: string) {
  //   this.router.navigateByUrl('/search/' + ticker);
  // }

  openModal(content: any, type: string) {
    this.transType = type;
    this.modalService.open(content);
  }

  isValidInput(ticker: string) {
    if (this.transType == 'Buy')
      return (this._quantity > 0) && (this.wallet > this.stockPriceMap.get(ticker) * this._quantity);
    else
      return this._quantity <= this.localStorage.getFromPortfo(ticker).content?.quantity;
  }

  transStock(ticker: string, name: string) {
    let total = Math.round((this._quantity * this.stockPriceMap.get(ticker) + Number.EPSILON) * 100) / 100;
    let value: HoldStock = { ticker: ticker, name: name, quantity: this._quantity, total: total };
    this.localStorage.setToPortfo(this.transType, ticker, value);
    if (!this.localStorage.inStorage('portfo', ticker)) {
      this.stockPriceMap.delete(ticker);
      this.modalService.dismissAll();
    }
    this.wallet = this.localStorage.getWallet();
    this.portfoList = this.localStorage.getAllPortfo();
    this.isEmpty = this.portfoList.length == 0;
    if (this.transType == "Buy")
      this._trans.next(`${ticker} bought`);
    else
      this._trans.next(`${ticker} sold`);
    this.modalService.dismissAll();
  }

  calAvg(currTotal: number, currQuan: number) {
    let avg = currTotal / currQuan;
    return Math.round((avg + Number.EPSILON) * 100) / 100;
  }

}
