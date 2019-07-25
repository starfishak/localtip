import { Component, OnInit } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { PlacesService } from 'src/app/services/places.service';
import { GooglePlacesService } from 'src/app/services/google-places.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { resolveComponentResources } from '@angular/core/src/metadata/resource_loading';
import {ScrollDetail} from '@ionic/core';
import {HttpClient} from '@angular/common/http';
import { Unsplash } from 'src/cred';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  results: any;
  user_info: any;
  location = '-42.8811368,147.3266763';
  loading = false;
  next = '';
  more_data = true;
  error_message: string;
  showToolbar = false;
  image_url = 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80';
  photographer = ""


  constructor(private PlacesService: PlacesService, private geolocation: Geolocation, private http: HttpClient) {}

  async ngOnInit() {
    console.log("about to run location")
    await this.setLocation();
    console.log("location set")
    console.log("ngoninit location: " + this.location)
    this.PlacesService.initData(this.location).subscribe(
        (res) => {
            console.log(res);
            this.results = res.results.items;
            this.next = res.results.next;
            this.more_data = true; // TODO: failsafe
            this.user_info = res.search.context.location.address;
            this.headerImage();
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
        console.log("1")
        this.PlacesService.getNextPage(this.location, this.next)
            .subscribe(
                res => {
                    for (let entry of res.items) {
                        this.results.push(entry);
                    }
                    console.log("4");
                    if (res.results.hasOwnProperty('next')) {
                        this.next = res.results.next;
                    }
                    else {
                        this.more_data = false;
                    }
                },
                error => this.error_message = <any>error);
        console.log("5")
    }
    console.log("6");
    ev.target.complete();
  }

  headerImage() {
       this.http.get(
          `https://api.unsplash.com/search/photos?page=1&per_page=1&query=${this.user_info.city}&client_id=${Unsplash.apiKey}&client_secret=${Unsplash.secretKey}`
      ).subscribe(
          res => {
              // @ts-ignore
              this.image_url = res.results[0].urls.regular;
              // @ts-ignore
              this.photographer = res.results[0].user.name;
          }
       )
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
