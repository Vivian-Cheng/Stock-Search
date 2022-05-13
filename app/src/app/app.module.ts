import { CacheRouteService } from './cache-route.service';
import { RouteReuseStrategy } from '@angular/router';
import { ApiService } from './api.service';
import { LocalStorageService } from './local-storage.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { HighchartsChartModule } from 'highcharts-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgNavbarComponent } from '../ng-navbar/ng-navbar.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { SearchComponent } from '../search/search.component';
import { SummaryComponent } from '../summary/summary.component';
import { NewsComponent } from '../news/news.component';
import { InsightsComponent } from '../insights/insights.component';
import { ChartsComponent } from '../charts/charts.component';
import { WatchlistComponent } from '../watchlist/watchlist.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';

@NgModule({
  declarations: [
    AppComponent,
    NgNavbarComponent,
    SearchbarComponent,
    SearchComponent,
    SummaryComponent,
    NewsComponent,
    InsightsComponent,
    ChartsComponent,
    WatchlistComponent,
    PortfolioComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    HighchartsChartModule
  ],
  providers: [ApiService, LocalStorageService, { provide: RouteReuseStrategy, useClass: CacheRouteService }],
  bootstrap: [AppComponent]
})
export class AppModule { }
