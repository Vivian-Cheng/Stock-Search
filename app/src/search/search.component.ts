import { pipe, Observable, forkJoin, Subject, filter } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Event, RouterEvent, ActivationEnd } from '@angular/router';
import { ApiService } from '../app/api.service';
import { LocalStorageService, HoldStock } from '../app/local-storage.service';
import { NgbModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  isLoading = true;
  // data related to company description and summary
  ticker: string;
  myUrl: string = '';
  interval: any;
  compDescript: any;
  compCandle: any;
  compQuote: any;
  compPeer: any;
  currTime: any;
  isWatched = false;
  isBought = false;
  isMarketOpen = false;
  // data related to wallet and transaction
  _quantity: number = 0;
  wallet: number = this.localStorage.getWallet();
  transType: string = "";
  watchAlertMsg = '';
  transAlertMsg = '';
  private _watch = new Subject<string>();
  private _trans = new Subject<string>();
  @ViewChild('watchAlert', { static: false }) watchAlert!: NgbAlert;
  @ViewChild('transAlert', { static: false }) transAlert!: NgbAlert;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private localStorage: LocalStorageService, private modalService: NgbModal) {
    this.ticker = "";
    this.compDescript = [];
    this.compQuote = [];
    this.currTime = Math.floor(Date.now() / 1000);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.ticker = params.get('ticker')!;
      this.myUrl = '/search/' + this.ticker;
      this.runAll();

      this.interval = setInterval(() => {
        if (this.router.url.includes('search')) {
          //console.log()
          this.run()
        }
      }, 15000);
    });

    this.router.events.subscribe(e => {
      if (e instanceof ActivationEnd &&
        Object.is(e?.snapshot?.component, SearchComponent)) {
        //console.log(e);
        this.isWatched = this.localStorage.inStorage('watch', this.compDescript.ticker);
        this.isBought = this.localStorage.inStorage('portfo', this.compDescript.ticker);
      }
    });

    this._watch.subscribe(message => this.watchAlertMsg = message);
    this._watch.pipe(debounceTime(5000)).subscribe(() => {
      if (this.watchAlert) {
        this.watchAlert.close();
      }
    });
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

  getAll(): Observable<any> {
    return forkJoin([this.api.getDescript(this.ticker), this.api.getQuote(this.ticker), this.api.getPeers(this.ticker)]);
  }

  runAll() {
    this.isLoading = true;
    this.getAll().subscribe(res => {
      this.compDescript = res[0];
      this.isWatched = this.localStorage.inStorage('watch', this.compDescript.ticker);
      this.isBought = this.localStorage.inStorage('portfo', this.compDescript.ticker);
      let today = Math.floor(Date.now() / 1000);
      this.checkMarketOpen(res[1], today);
      if (res[2].error) {
        res[2] = [];
      }
      this.compPeer = res[2];
      this.isLoading = false;
    })
  }

  run() {
    this.api.getDescript(this.ticker).subscribe((data => {
      this.compDescript = data;
      //console.log("description", data);
    }))
    let today = Math.floor(Date.now() / 1000);
    this.api.getQuote(this.ticker).subscribe(data => {
      this.checkMarketOpen(data, today)
      //console.log("quote", data);
    })
    this.api.getPeers(this.ticker).subscribe((data => {
      if (data.error) {
        data = [];
      }
      this.compPeer = data;
      //console.log("peers", data);
    }))
  }

  checkMarketOpen(data: any, now: number) {
    Object.keys(data).forEach((key: any) => {
      if (data[key] == null)
        data[key] = 0;
    })
    this.compQuote = data;
    // prevent data.t error, assign init value
    let from = (now - 21600).toString();
    let to = now.toString();
    if (data.t) {
      if (now - data.t < 60) {
        this.isMarketOpen = true;
        this.currTime = now;
        to = now.toString();
        from = (now - 21600).toString();
      } else {
        this.isMarketOpen = false;
        to = data.t;
        from = (data.t - 21600).toString();
      }
    }
    this.api.getCandle(this.ticker, "5", from, to).subscribe(data => {
      this.compCandle = data;
      //console.log("candle", data);
    })
  }

  clickWatch() {
    if (this.isWatched && this.compDescript.length != 0) {
      this._watch.next(`removed from`);
      this.localStorage.rmFromWatch(this.compDescript.ticker);
    }

    this.isWatched = !this.isWatched;
    if (this.isWatched && this.compCandle.length != 0) {
      this._watch.next(`added to`);
      this.localStorage.setToWatch(this.compDescript.ticker, { 'ticker': this.ticker, 'name': this.compDescript.name, 'c': this.compQuote.c, 'd': this.compQuote.d, 'dp': this.compQuote.dp });
    }

  }

  openModal(content: any, type: string) {
    this.transType = type;
    this.modalService.open(content);
  }

  isValidInput() {
    if (this.transType == 'Buy')
      return (this._quantity > 0) && (this.wallet > this.compQuote.c * this._quantity);
    else
      return this._quantity <= this.localStorage.getFromPortfo(this.compDescript.ticker).content?.quantity;
  }

  transStock() {
    let total = Math.round((this._quantity * this.compQuote.c + Number.EPSILON) * 100) / 100;
    let value: HoldStock = { ticker: this.ticker, name: this.compDescript.name, quantity: this._quantity, total: total };
    this.localStorage.setToPortfo(this.transType, this.compDescript.ticker, value);
    this.wallet = this.localStorage.getWallet();
    this.isBought = this.localStorage.inStorage('portfo', this.compDescript.ticker);
    if (this.transType == "Buy")
      this._trans.next(`bought`);
    else
      this._trans.next(`sold`);
    this._quantity = 0;
    this.modalService.dismissAll();
  }

}
