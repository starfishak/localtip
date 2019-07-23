import { Component, OnInit } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { PlacesService } from 'src/app/services/places.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { resolveComponentResources } from '@angular/core/src/metadata/resource_loading';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  results: any;
  // use global location temp
  location = '-43.952033,-176.559457';
  loading = false;
  next = '';
  more_data = true;
  error_message: string;


  constructor(private PlacesService: PlacesService, private geolocation: Geolocation) {}


  async ngOnInit() {
      console.log("about to run location")
    await this.setLocation();
      console.log("location set")
    console.log("ngoninit location: " + this.location)
    this.PlacesService.initData(this.location).subscribe(
        (res) => {
            this.results = res.items;
            this.next = res.next;
            this.more_data = true;
        },
        error =>  this.error_message = <any>error);
  }

  loadData(ev) {
    console.log("loadData called. next: " + this.next);
    if (!this.more_data) {
        console.log("no more data")
        ev.target.disabled = true;
    }

    else {
        // setTimeout(() => {
            console.log("1")
            this.PlacesService.getNextPage(this.location, this.next)
                .subscribe(
                    res => {
                        console.log("3");
                        for (let entry of res.items) {
                            this.results.push(entry);
                        }
                        console.log("4");
                        if (res.hasOwnProperty('next')) {
                            this.next = res.next;
                        }
                        else {
                            this.more_data = false;
                        }
                    },
                    error => this.error_message = <any>error);
        // }, 3000)
        console.log("5")
    }
    console.log("6");
    ev.target.complete();
  }

  async setLocation() {
      console.log("set location")
      await this.geolocation.getCurrentPosition().then((response) => {
          this.location = response.coords.latitude + ',' + response.coords.longitude;
          console.log("Set location: " + this.location);
      }).catch((error) => {
          console.log('Error getting location', error);
      });
      console.log("this is in the middle + location : " + this.location)
  }

  searchChanged(location) {
    console.log("changed")
  }
}
