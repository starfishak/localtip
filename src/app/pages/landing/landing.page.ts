import { Component, OnInit } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { PlacesService } from 'src/app/services/places-service/places.service';
import { InterestService } from 'src/app/services/interest-service/interest.service'
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { resolveComponentResources } from '@angular/core/src/metadata/resource_loading';
import { ScrollDetail } from '@ionic/core';
import { HttpClient } from '@angular/common/http';
import { Unsplash } from 'src/cred';
import { CategoryIcons } from 'src/app/category-icons'


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})


export class LandingPage implements OnInit {
  // Results
  results = [];
  show_results = false;
  out_of_results = { title: "Out of Places", category: { title: "Oh No!" }, vicinity: "Try expanding your search above.", distance: 0, id: 1};
  user_info: any;
  location = '';
  radius = 1000;
  loading = false;
  next = '';
  more_data: boolean;
  error_message: any;

  // Search Location
  search_toggled = false;

  // Images
  image_url = 'https://lh3.googleusercontent.com/4UwYMe1FJboZaf_u-O4Ri1FTv3tllTvqbZMnY4s2Nj1P_w06m55YsDp2dT2f3SwlI49Mp2ab636hoxzZ2yUIzWyUQ9pY80dUfnpCsy0c-LxSONQ6SqJyC0CKiIi1RkxZR0TKDhB9NM7ephyeC2FHDpFpb4GepM0TQiUhhUlpT0TtVnlnr3gyqKi5otr9doaHR4_3OldNnVWfGmEM7Kj1mTzkgntkti7cIbdRBMiOAWNSL0_TlsYW0oeRcliTmYDXWeIS5dFUJtoDSGJEkYiThV0ErkK0239VhOCqHpAJboA3pmISSoUJgra3B1T88BBENSkcp6WGuWdQhIQ25XAWIgGZ-2bjIHimobCv1wS_X1yN2cJDUoQ_BVyWARbPzopi_XV-Un86Gwh4-2wPh64uL7aoZf6ogCnKmjERJ7assEs3fFVVwB0iV-v4A-VUnirIF4d633uiXZG63pxdArWguEoDxBQ_whZCFSjTdabEGyYWFpWu7oNOBPWmUhZsd4rSh7YZaWceRomCn6OrSBYw7uCrUNrrVJTIZElrVGvQyCLF6LsF2tvOGFO6yYMnSfVqRc-3r4UMjngfN5yopVBplMOlZ8O48afbLfO2X6uYjd0WTEfhWDkw3x2L_eKBE3jxFewY7RxbRttqE_U6-CZ2iZdQmsAWJbNr=w2046-h1536-no'; // default image
  photographer = ""

  // Chips
  categories: any;
  chips: any;
  active_chips = [];
  interests_toggled = false;

  constructor(private PlacesService: PlacesService, private InterestService: InterestService, private geolocation: Geolocation, private http: HttpClient) {}

    /**
     * Initial load of page
     * In order:
     *      - Gets user location
     *      - Call places service on that location
     *      - Subscribe to HTTP data
     *      - Clean it
     * @param locationProvided optional boolean if a location is preset and should not use the setLocation method
     */
  async ngOnInit(locationProvided? : boolean) {
    if (!locationProvided) {
        await this.setLocation();
    }
    await this.PlacesService.initData(this.location, this.radius).then(
        data => {
            data.subscribe(
                (res) => {
                    // @ts-ignore
                    this.results = res.results.items; // Items to display in list
                    this.show_results = true;
                    // @ts-ignore
                    this.user_info = res.search.context.location.address;  // for vicinity and city title
                    this.headerImage();
                    this.generateChips();


                    // Next Page for Scroll
                    // @ts-ignore
                    this.next = res.results.next
                    if (this.next == undefined) { // if next page is undefined/does not exist, there is no more data
                        this.more_data = false;
                        this.results.push(this.out_of_results) // push last result card
                    } else {
                        this.more_data = true;
                    }
                },
                error => this.error_message = <any>error // push error if error
            );
        }
    )
}

    /**
     * Called by Ion-Infinite to get more data when user reaches bottom of list.
     * @param ev event of scroll, used to disable and call complete() method once op. is finished
     */
  loadData(ev) {
      // If out of data, disable infinife scroll
      if (!this.more_data) {
          ev.target.disabled = true;
      }
      else {
          // Calls places service to get next page
          this.PlacesService.getNextPage(this.next).subscribe(
              (res) => {
                  // Pushes new list items onto existing array
                  // @ts-ignore
                  for(let entry of res.items) {
                      this.results.push(entry);
                  }
                  // Checks if there is more data in form of a next url provided by HERE API
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

    /**
     * Gets header image based on user location from the Unsplash API
     * Prioritizes query in following order:
     *      -city
     *      -state code (USA)
     *      -country
     * @param useCountryImage optional parameter specifying whether to use the country as the seach query.
     * e.g.: if Wellington, NZ does not exist as an image in the DB, use New Zealand as the query parameter
     */
  headerImage(useCountryImage? : boolean) {
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

    /**
     * Gets user location and sets this parameter in variable
     * If error, pulls the users last known location from the InterestService storage module
     */
    async setLocation() {
        await this.geolocation.getCurrentPosition().then((response) => {
            this.location = response.coords.latitude + ',' + response.coords.longitude;
            this.InterestService.setKnownLocation(this.location)
        }).catch(async (error) => {
            await this.InterestService.getLastLocation().then(
                location => {
                    console.log(location)
                    this.location = location
                }
            )
        });
    }

    /**
     * Called when user enters text into location search text. Updates the list based on their query
     * @param event search event given by Ionic
     */
  async locationSearch(event) {
    this.show_results = false
    let search = event.target.value.toLowerCase();
    let location = this.PlacesService.getGeocode(search).subscribe(
            (res : any) => {
                console.log(res)
                let item = res.Response.View[0].Result[0]
                // @ts-ignore
                if (item.hasOwnProperty("Location")) {
                    this.location = item.Location.DisplayPosition.Latitude + ',' + item.Location.DisplayPosition.Longitude;
                }
                this.InterestService.setKnownLocation(this.location)
                this.ngOnInit(true);
                this.InterestService.getLastLocation().then(
                    loc => {
                        console.log("Use last known")
                        this.location = loc
                        this.ngOnInit(true)
                    }
                )
            },
        (error) => {
                this.ngOnInit()
            }
        )
  }

    /**
     * Called when user presses search button on homepage to search by location
     */
    toggle_search() {
        this.search_toggled = !this.search_toggled;
    }

    /**
     * Location Refresh Function. Called when user "Pulls down" on the homepage.
     * @param event Refresh Event provided by Ionic
     */
      doRefresh(event) {
        // Call Init again - Refresh Location & Results. Makes things easier to just re-init the page.
        this.ngOnInit();

        setTimeout(() => {
            // End the event after some time to remove the loading spinner. We do not want the user to be annoyed
            event.target.complete();
        }, 2000);
      }

    /**
     * Called when user presses "Person" icon to show the interest page
     */
      async toggle_interests() {
          this.interests_toggled = !this.interests_toggled
      }

    /**
     * Generates option chips for user from the Interest Service
     * See interest service for more details on how chips are generated.
     */
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

          // Checks if most prominent category
          if (mostElementCategories.count != 0) {
              // @ts-ignore
              let cateid = mostElementCategories.id;
              // @ts-ignore
              let categoryIcon = mostElementCategories.id.replace(/-/g, '')
              let icon = CategoryIcons[categoryIcon]
              if (icon == undefined) {
                  icon = "pin"
              }
              // @ts-ignore
              this.chips.push({title:mostElementCategories.title, icon:icon, id:cateid, active:false})
          }

          // Expand Search Radius
          this.chips.push({title: "Expand Radius", id: "radius", icon:"pin", active:false})

          // Transit Chip
          this.chips.push({title: "Public Transit", id: "transport", icon:"bus", active:false})

          // Get Time Based Chips from interest service
          let timechips = this.InterestService.timeBasedChips();
          for (let chip of timechips) {
              this.chips.push(chip)
          }

          // Clear all filters chip
          this.chips.push({title: "Clear Filters", id: "clear", icon:"close-circle", active:false})
      }

    /**
     * Toggles the list based on the users category selection from the chips
     * @param id
     */
      searchByChip(id?: string) {
          // Check if user is clearing filters or inc. radius
          if (id == "radius") {
              this.radius += 2000
          }
          else if(id == "clear") {
               // remove active chips and refresh page to original settings
              this.active_chips = []
              this.toggleChipColor(id, this.chips.findIndex(item => item.id === id))
              this.ngOnInit(true)
              return
          }
          else {
              // Begin toggle of a normal category
              let chip_index = this.chips.findIndex(item => item.id === id)
              if (this.chips[chip_index].active) {
                  let active_chip_index = this.active_chips.findIndex(item => item.id === id)
                  this.active_chips.splice(active_chip_index, 1)
              }
              else {
                  if (id != undefined) {
                      this.active_chips.push({
                          id: id
                      })
                  }
              }
              this.toggleChipColor(id, chip_index)
          }
          let query = ""
          for (let chip of this.active_chips) {
              query += (chip.id + ',')
          }

          this.PlacesService.getDataByCategory(query.substr(0, query.length-1), this.location, this.radius).subscribe(
              (res) => {
                  // @ts-ignore
                  this.results = res.results.items; // Items to display in list
                  // @ts-ignore
                  this.next = res.results.next
                  if (this.next == undefined) { // if next page is undefined/does not exist, there is no more data
                      // this.more_data = false;
                      this.results.push(this.out_of_results) // push last result card
                  } else {
                      this.more_data = true;
                  }
              }
          )
      }

    /**
     * Toggles the color of a chip by changing the active atribute and reloading the DOM
     * @param id ID of the category we are toggling
     * @param chip_index index of where this category is found on this array chips
     */
      toggleChipColor(id : string, chip_index : number) {
          this.chips[chip_index].active = !this.chips[chip_index].active
      }

}
