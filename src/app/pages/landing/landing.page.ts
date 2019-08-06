import { Component, OnInit } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { PlacesService } from 'src/app/services/places.service';
import { InterestService } from 'src/app/services/interest.service'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { resolveComponentResources } from '@angular/core/src/metadata/resource_loading';
import { ScrollDetail } from '@ionic/core';
import { HttpClient } from '@angular/common/http';
import { Unsplash } from 'src/cred';
import { PopoverController } from '@ionic/angular';
import { LocationSearchPopoverComponent } from 'src/app/components/location-search-popover/location-search-popover.component';
import { Categories } from 'src/categories'


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})



export class LandingPage implements OnInit {
  // Results
  results = [];
  out_of_results = { title: "Out of Places", category: { title: "Oh No!" }, vicinity: "Try expanding your search above." };
  user_info: any;
  location = '-46.6301012,169.068374';
  loading = false;
  search_toggled = false;
  next = '';
  more_data: boolean;
  error_message: string;
  showToolbar = false;

  // Images
  image_url = 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80';
  photographer = ""

  // Chips
  categories: any;
  // chips = [["Dinner", "pizza"], ["Nightlife", "wine"], ["Movies", "film"], ["Open Now", "time"], ["Dinner", "pizza"], ["Nightlife", "wine"], ["Movies", "film"], ["Open Now", "time"]]
    chips = []

  constructor(private PlacesService: PlacesService, private InterestService: InterestService, private geolocation: Geolocation, private http: HttpClient, private popoverController : PopoverController) {}

  async ngOnInit() {
    console.log("about to run location")
    await this.setLocation();
    console.log("location set")
    console.log("ngoninit location: " + this.location)
    this.PlacesService.initData(this.location).subscribe(
        (res) => {
            console.log(res);
            // @ts-ignore
            this.results = res.results.items;
            // @ts-ignore
            this.user_info = res.search.context.location.address;
            this.headerImage();
            this.generateChips();

            // Next Page for Scroll
            // @ts-ignore
            this.next = res.results.next
            if (this.next == undefined) {
                this.more_data = false;
                this.results.push(this.out_of_results)
            }
            else {
                this.more_data = true;
            }
        },
        error =>  this.error_message = <any>error
    );
}

  loadData(ev) {
      if (!this.more_data) {
          ev.target.disabled = true;
      }
      else {
          this.PlacesService.getNextPage(this.next).subscribe(
              (res) => {
                  console.log(res);
                  // @ts-ignore
                  for(let entry of res.items) {
                      this.results.push(entry);
                  }
                  // @ts-ignore
                  console.log(res.next)
                  // @ts-ignore
                  if (res.next != undefined) {
                      // @ts-ignore
                      this.next = res.next;
                  }
                  else {
                      this.more_data = false;
                      this.results.push(this.out_of_results);
                  }
              }
          )
      }
      ev.target.complete();
  }

  headerImage(useCountryImage? : boolean) {
      console.log(this.user_info)
      let search_term = ''
      if (useCountryImage) {
          search_term = this.user_info.country;
      }
      else {
          if (this.user_info.hasOwnProperty('city')) {
              search_term = this.user_info.city;
          } else if (this.user_info.hasOwnProperty('stateCode')) {
              search_term = this.user_info.stateCode;
          } else {
              search_term = this.user_info.country;
          }
      }
       this.http.get(
          `https://api.unsplash.com/search/photos?page=1&per_page=1&query=${search_term}&client_id=${Unsplash.apiKey}&client_secret=${Unsplash.secretKey}`
      ).subscribe(
          res => {
              // @ts-ignore
              if (res.total == 0) {
                  this.headerImage(true)
                  return
              }
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

  // Called when user enters text into the locaiton search bar
  async locationSearch(event) {
    let search = event.target.value.toLowerCase();
    console.log("Location Search: ", search);
    const popover = await this.popoverController.create({component:LocationSearchPopoverComponent, componentProps:{searchTerm:search}})
    return await popover.present();
  }


  // Location Refresh Function. Called when user "Pulls down" on the homepage.
  doRefresh(event) {
    // Call Init again - Refresh Location & Results. Makes things easier to just re-init the page.
    this.ngOnInit();

    setTimeout(() => {
        // End the event after some time to remove the loading spinner. We do not want the user to be annoyed
        event.target.complete();
    }, 2000);
  }

  // Changes the state of the search bar
  toggle_search() {
      this.search_toggled = !this.search_toggled;
  }

  // Generates option chips for user
  generateChips() {
      this.chips = []
      // Category Chips
      this.categories = {}
      this.categories.categories = {}
      let mostElementCategories = {count: 0}
      for (let item of this.results) {
          // @ts-ignore
          let category = item.category.id;
          if (this.categories.categories.hasOwnProperty(category)) {
              this.categories.categories[category].count += 1;
              if (this.categories.categories[category].count > mostElementCategories.count) {
                  mostElementCategories = this.categories.categories[category]
              }
          }
          else {
              this.categories.categories[category] = {}
              this.categories.categories[category].title = item.category.title
              this.categories.categories[category].count = 1;
              this.categories.categories[category].id = category
          }
      }
      console.log(mostElementCategories)
      // Checks if most promiminte catego
      if (mostElementCategories.count != 0) {
          // @ts-ignore
          let categoryIcon = mostElementCategories.id.replace(/-/g, '')
          let icon = Categories[categoryIcon]
          if (icon == undefined) {
              icon = "pin"
          }
          // @ts-ignore
          this.chips.push([mostElementCategories.title, icon])
      }

      // Get Time Based Chips from interest service
      let timechips = InterestService.timeBasedChips();
      for (let chip of timechips) {
          this.chips.push(chip)
      }
  }
}
