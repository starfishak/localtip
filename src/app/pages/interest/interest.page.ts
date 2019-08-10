import { Component, OnInit } from '@angular/core';
import { InterestService } from 'src/app/services/interest-service/interest.service'

@Component({
  selector: 'app-interest',
  templateUrl: './interest.page.html',
  styleUrls: ['./interest.page.scss'],
})
export class InterestPage implements OnInit {
  categories : any

  constructor(private InterestService : InterestService) {}

  async ngOnInit() {
      // Check if first-time user
      this.InterestService.clearStorage()
      let status = await this.InterestService.newUser()
      if (status) {
          await this.InterestService.initUserInterest()
      }
      // this.InterestService.printStorage()
      await this.InterestService.getPreferenceList()
      this.categories = this.InterestService.preference_list
  }

  segmentChanged(id) {
      console.log("Toggle " + id.target)
      // this.InterestService.toggleInterest(id)
  }

  newUserInitInterests() {
  }

}
