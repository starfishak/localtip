import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PlacesService } from 'src/app/services/places.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { resolveComponentResources } from '@angular/core/src/metadata/resource_loading';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  results: Observable<any>;
  // use global location temp
  location = '61.2171,-149.8922';

  constructor(private PlacesService: PlacesService, private geolocation: Geolocation) { }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.location = resp.coords.latitude + ',' + resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });
    // this.geolocation.getCurrentPosition(
    //   position => {
    //     console.log('location find success');
    //     this.location = position.coords.latitude + ',' + position.coords.longitude
    //   },
    //   error => {
    //     console.log('Error getting location', error);
    //   }
    // )
  }

  searchChanged(location) {
    this.results = this.PlacesService.searchData(this.location);
  }

}
