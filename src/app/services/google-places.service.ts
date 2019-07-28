import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesService {

    constructor(private http: HttpClient) { }

    search_url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    details_url = 'https://maps.googleapis.com/maps/api/place/details/json?';
    apiKey = 'AIzaSyCBzQSMMgQxrzl6KX33Kh3HunFdLfNYV34'

    initData(location: string) : Observable<any> {
        return this.http.get(
            `${this.search_url}location=${location}&key=${this.apiKey}`)
            .pipe(
                map(res => res),
                catchError(this.handleError)
            );
    }

    getNextPage(location : string, token : string) : Observable<any> {
        console.log("2");
        return this.http.get(`${this.search_url}pagetoken=${token}&key=${this.apiKey}`)
            .pipe(
                map(res => res),
                catchError(this.handleError))
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
        return Observable.throw(errMsg);
    }

    getDetails(id: string) {
        return this.http.get(`${this.details_url}placeid=${id}&key=${this.apiKey}`);
    }


}
