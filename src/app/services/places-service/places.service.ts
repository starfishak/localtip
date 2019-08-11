import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Credentials } from 'src/cred';
import { InterestService } from 'src/app/services/interest-service/interest.service'


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

    /**
     * HERE API Information
     * Credentials imported from src/cred.ts file which is not included git repo
     */
    browse_url = 'https://places.cit.api.here.com/places/v1/browse';
    lookup_url = 'https://places.cit.api.here.com/places/v1/places/lookup'
    apiCode = Credentials.apiCode;
    apiKey = Credentials.apiKey;

    constructor(private http: HttpClient, private InterestService : InterestService) {
    }

    /**
     * Get initial set of data from a set of coordinates
     * @param location string coordinates as formatted string
     * @param radius discribes in meters the meximum distance a place can be from the given coordinates
     */
    initData(location: string, radius : number) {
        let search_radius = radius + ''
        return this.InterestService.getQueryString().then(
            query => {
                let result = this.http.get(
                    `${this.browse_url}?app_code=${this.apiCode}&app_id=${this.apiKey}&in=${encodeURI(location)};r=${search_radius}&pretty=true&cat=${query}`)
                return result
            }
        )

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

    /**
     * Get data from the HERE API via provided URL, usually from href key-value pair in the returned JSON objects
     * @param url given by HERE API with key: href
     */
    getDataFromURL(url : string) {
        return this.http.get(url);
    }

    /**
     * Gets and returns the URL for data based on a specific category
     * @param query string ID of the category to request from API (max 1)
     * @param string string repersentation of the user location
     */
    getDataByCategory(query : string, location : string, radius : number) {
        let search_radius = radius + ''
        console.log(`${this.browse_url}?app_code=${this.apiCode}&app_id=${this.apiKey}&in=${encodeURI(location)};r=${search_radius}&pretty=true&cat=${query}`)
        let result = this.http.get(
            `${this.browse_url}?app_code=${this.apiCode}&app_id=${this.apiKey}&in=${encodeURI(location)};r=${search_radius}&pretty=true&cat=${query}`)
        return result
    }

    /**
     * Process a geocode request for string query into Observable.
     * I.E. takes query and converts it into a location based on the HERE API
     * @param searchTerm location query to search
     */
    getGeocode(searchTerm : string) {
        return this.http.get(`http://geocoder.api.here.com/6.2/search.json?app_id=${Credentials.apiKey}&app_code=${Credentials.apiCode}&searchtext=${searchTerm}`)
    }
}
