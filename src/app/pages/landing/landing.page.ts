import { Component, OnInit } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { PlacesService } from 'src/app/services/places.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { resolveComponentResources } from '@angular/core/src/metadata/resource_loading';
import { concat } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  results: Observable<any>;
  // use global location temp
  location = '61.2171,-149.8922';
  loading = false;
  nextResults = '';

  constructor(private PlacesService: PlacesService, private geolocation: Geolocation) { }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.location = resp.coords.latitude + ',' + resp.coords.longitude;
      this.results = this.PlacesService.searchData(this.location);
      console.log(this.results);

      // Store next results URL endpoint
      //console.log("Next: ", this.results['next']);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  loadMoreData(ev) {
    console.log(this.nextResults);
    this.results = concat(this.results, this.PlacesService.getDatabyUrl(this.nextResults));
  }

  searchChanged(location) {
    this.results = this.PlacesService.searchData(this.location);
  }
}
