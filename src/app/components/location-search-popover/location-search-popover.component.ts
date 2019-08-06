import { Component, OnInit } from '@angular/core';
import { Credentials } from 'src/cred';
import {HttpClient} from '@angular/common/http';
import {PopoverController, NavParams} from '@ionic/angular';



@Component({
  selector: 'app-location-search-popover',
  templateUrl: './location-search-popover.component.html',
  styleUrls: ['./location-search-popover.component.scss'],
})

export class LocationSearchPopoverComponent implements OnInit {
   matches = [];

   constructor(private http: HttpClient, private PopoverController : PopoverController, public navParams: NavParams) {}

   ngOnInit() {
       let searchTerm = this.navParams.data.searchTerm;
       console.log(this.navParams.data)
       console.log(`http://geocoder.api.here.com/6.2/search.json?app_id=${Credentials.apiKey}&app_code=${Credentials.apiCode}&searchtext=${searchTerm}`)
       this.http.get(`http://geocoder.api.here.com/6.2/search.json?app_id=${Credentials.apiKey}&app_code=${Credentials.apiCode}&searchtext=${searchTerm}`)
           .subscribe(
               (res : any) => {
                   for (let item of res.Response.View[0].Result) {
                       console.log(item)
                       // @ts-ignore
                       let lat_long = item.Location.DisplayPosition.Latitude + ',' + item.Location.DisplayPosition.Longitude;
                       // @ts-ignore
                       this.matches.push([item.Location.Address.Label, lat_long])
                   }
               }
           )
   }

   close() {
       this.PopoverController.dismiss()
   }


}

