import { PortfolioComponent } from '../portfolio/portfolio.component';
import { WatchlistComponent } from '../watchlist/watchlist.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { SearchComponent } from '../search/search.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/search/home', pathMatch: 'full'
  },
  {
    path: 'search', component: SearchbarComponent, children: [
      { path: 'home', children: [], data: { active: 'home' } },
      { path: ':ticker', component: SearchComponent, data: { active: ':ticker' } }
    ]
  },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: '**', component: SearchbarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
