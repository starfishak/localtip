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

  constructor(private activatedRoute: ActivatedRoute, private PlacesService: PlacesService, private http : HttpClient) { }

  ngOnInit(){
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    this.PlacesService.getDetails(id).subscribe(result => {
      console.log('result: ', result);
      this.pageinfo = result;
      this.updateMapImage()
      this.getRecommended()
    })
  }

  updateMapImage(){
      let latlong = this.pageinfo.location.position[0] + '%2C' + this.pageinfo.location.position[1]
      console.log(latlong)
      this.mapimageuri = `https://image.maps.api.here.com/mia/1.6/mapview?c=${latlong}&z=16&app_id=${Credentials.apiKey}&app_code=${Credentials.apiCode}`
  }

  open_link(value : string, label: string) {
      console.log("Open Link: " + value + " " + label)
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


}
