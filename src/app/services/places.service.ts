import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

browse_url = 'https://places.cit.api.here.com/places/v1/browse';
lookup_url = 'https://places.cit.api.here.com/places/v1/places/lookup'
apiKey = 'vUc1ZRcHoQbo5ewxIORP';
apiCode = 'kdj2WuRpwj3kouT9oEqO4w';

  constructor(private http: HttpClient) { }

  initData(location: string) : Observable<any> {
      console.log("queryurl: " +
          `${this.browse_url}?app_code=${this.apiCode}&app_id=${this.apiKey}&in=${encodeURI(location)};r=1000&pretty=true`);


      return this.http.get(
          `${this.browse_url}?app_code=${this.apiCode}&app_id=${this.apiKey}&in=${encodeURI(location)};r=1000&pretty=true`)
          .pipe(
              // @ts-ignore
            map(res => res),
            catchError(this.handleError)
          );
  }

  getNextPage(location : string, url : string) : Observable<any> {
    console.log("2");
    return this.http.get(url)
        .pipe(
        map(res => res),
        catchError(this.handleError))
  }

  extractData(res : Response) {
      console.log("extract data");
      console.log(res);
      let body = res.json();
      console.log("body: " + body)
      return body || { };
  }

  handleError(error: Response | any) {
      console.log("---error--- : " + error);
      let errMsg: string;
      if (error instanceof Response) {
          const body = error.json() || '';
          const err = body.error || JSON.stringify(body);
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } else {
          errMsg = error.message ? error.message : error.toString();
      }
      // console.error(errMsg);
      return Observable.throw(errMsg);
  }

  getDetails(id: string) {
      return this.http.get(`${this.lookup_url}?app_code=${this.apiCode}&app_id=${this.apiKey}&source=sharing&id=${id}`);
  }
}
