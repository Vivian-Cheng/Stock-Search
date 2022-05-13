import { Component, OnInit } from '@angular/core';
import { Event, RouterEvent, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-ng-navbar',
  templateUrl: './ng-navbar.component.html',
  styleUrls: ['./ng-navbar.component.css']
})
export class NgNavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  searchLink = '/search/home';
  curr = this.router.url;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((e: Event): e is RouterEvent => e instanceof RouterEvent)
    ).subscribe((e: RouterEvent) => {
      this.curr = e.url;
      if (this.curr.includes('search'))
        this.searchLink = this.curr;
    });

  }

}
