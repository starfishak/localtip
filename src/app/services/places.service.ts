import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export enum SearchType {
  location = '',
  location_missing = '61.2171,-149.8922'
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
// &in=52.521,13.3807;r=2000

browse_url = 'https://places.cit.api.here.com/places/v1/discover/explore';
lookup_url = 'https://places.cit.api.here.com/places/v1/places/lookup'
apiKey = 'vUc1ZRcHoQbo5ewxIORP';
apiCode = 'kdj2WuRpwj3kouT9oEqO4w';

  constructor(private http: HttpClient) { }

  searchData(location: string): Observable<any> {
    return this.http.get(`${this.browse_url}?app_code=${this.apiCode}&app_id=${this.apiKey}&in=${encodeURI(location)};r=1000&pretty=true`)
    .pipe(
      map(results => {
        console.log('RAW: ', results['results']['items']);
        return results['results']['items'];
      })
    );
  }

  getDetails(id: string) {
      return this.http.get(`${this.lookup_url}?app_code=${this.apiCode}&app_id=${this.apiKey}&source=sharing&id=${id}`);
  }
}
