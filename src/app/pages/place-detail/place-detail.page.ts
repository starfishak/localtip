import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from 'src/app/services/places.service';
import {HttpClient} from '@angular/common/http';
import {Credentials} from 'src/cred';
import {Icons} from './places-details-icons';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  pageinfo = null;
  mapimageuri: string;
  Icons = Icons;
  recommended: any;
  transit: any;
  transit_departures: any;
  schedule : boolean = true

  constructor(private activatedRoute: ActivatedRoute, private PlacesService: PlacesService, private http : HttpClient) { }

  ngOnInit(){
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    this.PlacesService.getDetails(id).subscribe(result => {
      console.log(result)
      this.pageinfo = result;
      this.getTransit()
      this.updateMapImage()
      this.getRecommended()
      // @ts-ignore
        if (result.categories[0].id == 'public-transport') {
          this.getTransitDepartures();
      }
    })
  }

  updateMapImage(){
      let latlong = this.pageinfo.location.position[0] + '%2C' + this.pageinfo.location.position[1]
      this.mapimageuri = `https://image.maps.api.here.com/mia/1.6/mapview?c=${latlong}&z=16&app_id=${Credentials.apiKey}&app_code=${Credentials.apiCode}`
  }

  open_link(value : string, label: string) {
      let url = ''
      if (label == "Phone") {
            url = 'tel:' + value
      }
      else if (label == "Email") {
            url = 'mailto:' + value
      }
      else {
            url = value
      }
      window.open(url, '_blank')
  }

  getRecommended() {
      // Get Data
      let url = this.pageinfo.related.recommended.href;
      this.http.get(url).subscribe(
          (res) =>
              // @ts-ignore
              this.recommended = res.items
      )
  }

  getTransit() {
      let url = this.pageinfo.related['public-transport'].href;
      this.http.get(url).subscribe(
          (res) => {
              // @ts-ignore
              this.transit = res.items;
              console.log(res.items)
          }
      )
  }

  getTransitDepartures() {
      let departures = []
      if (this.pageinfo.hasOwnProperty("extended")) {
          if (this.pageinfo.extended.hasOwnProperty("departures")) {
              for (let dep of this.pageinfo.extended.departures.schedule.items) {
                  let date = new Date(dep.scheduled.departure)
                  let dep_time = date.getHours() + ':' + date.getMinutes()
                  let line = {
                      direction: dep.direction,
                      line: dep.line,
                      time: dep_time
                  }
                  departures.push(line)
              }
              this.transit_departures = departures
              console.log(this.transit_departures)
          }
          else {
              this.schedule = false
          }
      }
      else {
          this.schedule = false
      }
  }

  // Since this is not a production app, navigation will be opened via window.open
    // as cordova plugins will not work in a testing environment
  open_navigation(position) {
      let url = "https://www.google.com/maps/search/?api=1&query=" + position[0] + ',' + position[1];
      window.open(url, "_blank")
  }
}
