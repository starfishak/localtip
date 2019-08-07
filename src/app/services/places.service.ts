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

    /**
     * HERE API Information
     * Credentials imported from src/cred.ts file which is not included git repo
     */
    browse_url = 'https://places.cit.api.here.com/places/v1/discover/explore';
    lookup_url = 'https://places.cit.api.here.com/places/v1/places/lookup'
    apiCode = Credentials.apiCode;
    apiKey = Credentials.apiKey;

    constructor(private http: HttpClient) {
    }

    /**
     * Get initial set of data from a set of coordinates
     * @param location string coordinates as formatted string
     */
    initData(location: string) {
        let result = this.http.get(
            `${this.browse_url}?app_code=${this.apiCode}&app_id=${this.apiKey}&in=${encodeURI(location)};r=1000&pretty=true&cat=going-out,sights-museums,transport`)
        return result
    }

    /**
     * Get the next page of data for infinite scroll.
     * @param url URL entrypoint for the next set of data
     */
    getNextPage(url: string) {
        let result = this.http.get(url);
        return result
    }

    /**
     * Get information about a specific place with a given id
     * @param id ID provided by the HERE API for a specific place.
     */
    getDetails(id: string) {
        return this.http.get(`${this.lookup_url}?app_code=${this.apiCode}&app_id=${this.apiKey}&source=sharing&id=${id}`);
    }
}
