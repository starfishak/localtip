import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Credentials } from 'src/cred';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

    browse_url = 'https://places.cit.api.here.com/places/v1/browse';
    lookup_url = 'https://places.cit.api.here.com/places/v1/places/lookup'
// Accidential apikey/code commit prior. Added credential file to .gitignore.
    // Keys and codes have been regenerated since.
    apiCode = Credentials.apiCode;
    apiKey = Credentials.apiKey;

    constructor(private http: HttpClient) {
    }

    initData(location: string) {
        let result = this.http.get(
            `${this.browse_url}?app_code=${this.apiCode}&app_id=${this.apiKey}&in=${encodeURI(location)};r=1000&pretty=true`)
        return result
    }

    getNextPage(url: string) {
        let result = this.http.get(url);
        return result
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
