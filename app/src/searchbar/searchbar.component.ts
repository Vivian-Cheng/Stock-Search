import { ApiService } from '../app/api.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap, finalize, delay } from 'rxjs/operators';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  @ViewChild('searchTicker') ticker!: ElementRef;
  searchSymbol = new FormControl();
  filterOptions: any;
  isLoading = false;
  notFound = false;
  notValid = false;
  routeLoading = false;

  constructor(private api: ApiService, private router: Router) {
    this.filterOptions = [];
  }
  displayWith(value: any) {
    return value?.symbol;
  }

  clear() {
    this.ticker.nativeElement.value = "";
    this.filterOptions = [];
    this.notFound = false;
    this.notValid = false;
    this.router.navigateByUrl('/search/home');
  }

  searchByclick() {

    this.api.getDescript(this.ticker.nativeElement.value).subscribe(data => {
      //console.log(data);
      if (data.length == 0)
        this.notValid = true;
      else if (Object.keys(data).length == 0)
        this.notFound = true;
      else {
        this.router.navigateByUrl('/search/' + this.ticker.nativeElement.value);
        this.notFound = false;
        this.notValid = false;
      }

    })
  }

  ngOnInit(): void {
    this.searchSymbol.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500),
      tap(() => this.isLoading = true),
      switchMap(value => {
        return this.api.getAutoComp(value).pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
      })
    ).subscribe(data => {
      if (data.error) {
        data = [];
      }
      this.filterOptions = data
    })
  }
}

