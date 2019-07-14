import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PlacesService } from 'src/app/services/places.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  results: Observable<any>;
  // use global location temp
  location = '61.2171,-149.8922';

  constructor(private PlacesService: PlacesService) { }

  ngOnInit() {
  }

  searchChanged(location) {
    this.results = this.PlacesService.searchData(this.location);
  }

}
