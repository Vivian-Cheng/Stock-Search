import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../app/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  isEmpty = false;
  watchlist: any = [];

  constructor(private localStorage: LocalStorageService, private router: Router) { }

  ngOnInit(): void {
    this.watchlist = this.localStorage.getAllWatch();
    this.isEmpty = this.watchlist.length == 0;
  }

  linkToSearch(ticker: string, isRemoved: boolean) {
    if (!isRemoved)
      this.router.navigateByUrl('/search/' + ticker);
  }

  rmStock(ticker: string) {
    this.localStorage.rmFromWatch(ticker);
    this.watchlist = this.localStorage.getAllWatch();
    this.isEmpty = this.watchlist.length == 0;
  }

}
