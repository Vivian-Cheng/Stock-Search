
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //apiUrl = 'http://127.0.0.1:3000';
  //apiUrl = 'http://csci571nodejs-env.eba-sx8smmpb.us-west-1.elasticbeanstalk.com';
  apiUrl = window.location.origin;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAutoComp(q: string) {
    if (q == "") {
      return of([]);
    }
    return this.http.get(`${this.apiUrl}/q/${q}`, this.httpOptions).pipe(
      map((data: any) => {
        if (data.error) {
          retry(2);
          return of([]);
        } else {
          return data.result.filter((item: any) => {
            return item.type == "Common Stock" && !item.symbol.includes('.');
          })
        }

      }),
      catchError((err) => {
        //console.log(err);
        retry(2);
        return of([]);
      })
    )
  }

  getDescript(q: string) {
    if (q == "")
      return of([]);
    return this.http.get(`${this.apiUrl}/descript/${q}`, this.httpOptions).pipe(
      map((data: any) => {
        if (data.error) {
          retry(2);
          return of([]);
        } else {
          return data;
        }

      }),
      catchError((err) => {
        //console.log(err);
        retry(2);
        return of([]);
      })
    );
  }
  getCandle(q: string, resolution: string, from: string, to: string) {
    if (q == "" || resolution == "" || from == "" || to == "")
      return of([]);
    return this.http.get(`${this.apiUrl}/candle/${q}/${resolution}/${from}/${to}`, this.httpOptions).pipe(
      map((data: any) => {
        if (data.error) {
          retry(2);
          return of([]);
        } else {
          return data;
        }
      }),
      catchError((err) => {
        //console.log(err);
        retry(2);
        return of([]);
      })
    );
  }
  getQuote(q: string) {
    return this.http.get(`${this.apiUrl}/quote/${q}`, this.httpOptions).pipe(
      map((data: any) => {
        if (data.error) {
          retry(2);
          return of([]);
        } else {
          return data;
        }
      }),
      catchError((err) => {
        //console.log(err);
        retry(2);
        return of([]);
      })
    );
  }
  getPeers(q: string) {
    return this.http.get(`${this.apiUrl}/peers/${q}`, this.httpOptions).pipe(
      map((data: any) => {
        if (data.error) {
          retry(2);
          return of([]);
        } else {
          return data;
        }
      }),
      catchError((err) => {
        //console.log(err);
        retry(2);
        return of([]);
      })
    );
  }
  getNews(q: string) {
    return this.http.get(`${this.apiUrl}/news/${q}`, this.httpOptions).pipe(
      map((data: any) => {
        if (data.error) {
          retry(2);
          return of([]);
        } else {
          return data;
        }
      }),
      catchError((err) => {
        //console.log(err);
        retry(2);
        return of([]);
      })
    );
  }
  getSentiment(q: string) {
    return this.http.get(`${this.apiUrl}/sentiment/${q}`, this.httpOptions).pipe(
      map((data: any) => {
        if (data.error) {
          retry(2);
          return of([]);
        } else {
          return data;
        }
      }),
      catchError((err) => {
        //console.log(err);
        retry(2);
        return of([]);
      })
    );
  }
  getRecommendation(q: string) {
    return this.http.get(`${this.apiUrl}/recommendation/${q}`, this.httpOptions).pipe(
      map((data: any) => {
        if (data.error) {
          retry(2);
          return of([]);
        } else {
          return data;
        }
      }),
      catchError((err) => {
        //console.log(err);
        retry(2);
        return of([]);
      })
    );
  }
  getEarnings(q: string) {
    return this.http.get(`${this.apiUrl}/earnings/${q}`, this.httpOptions).pipe(
      map((data: any) => {
        if (data.error) {
          retry(2);
          return of([]);
        } else {
          return data;
        }
      }),
      catchError((err) => {
        //console.log(err);
        retry(2);
        return of([]);
      })
    );
  }
}
