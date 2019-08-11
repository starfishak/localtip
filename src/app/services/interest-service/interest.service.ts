import { Injectable } from '@angular/core';
import { CategoryIcons } from 'src/app/category-icons';
import { Categories } from 'src/app/services/interest-service/category-list'

import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class InterestService {
    userCategories: any;
    preference_list : any;
    query_string : any;
    error_message = {
        id: "error",
        title: "An Error has Occurred",
        image: "https://images.unsplash.com/photo-1555861496-0666c8981751?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=60"
    }
    constructor(private storage : Storage) { }

    /**
     * Checks if a user is new, i.e. is user never opened app before
     * @return boolean if the user is new
     */
    newUser() {
        // checks if user is new
        return this.storage.length().then(
            res => {
                if (res == 0) {
                     return true
                }
                else {
                    return false
                }
            }
        )
    }

    /**
     * Sets user interest profile to the default settings
     */
    initUserInterest() {
        for (let category in Categories) {
            this.storage.set(Categories[category].id, Categories[category])
        }
    }

    /**
     * DEV METHOD
     * Clear local storage for testing
     */
    clearStorage() {
        this.storage.clear()
    }

    /**
     * Gets the users interest/preference list for the interest page
     */
    getPreferenceList() {
        this.preference_list = [] //reinit preference list to 0 items

        return this.storage.forEach(
            (key, value, iteration) => {
                this.preference_list.push(key)
            }
        )
    }

    /**
     * Toggle the interest provided
     * @param id for the interest e.g. eat-drink
     * @param toggle this is what the toggle currently reads. For reasoning on why this exists, see interest.page.ts
     * segmentChanged() method documentation
     */
    toggleInterest(id : string, toggle : string) {
        return this.storage.get(id).then(
            res => {
                let confirm = false // reason for this var and if gate exist, see interest.page.ts segmentChanged() method docs
                if (toggle == "yes") {
                    confirm = true
                }
                if (res.active !== confirm) {
                    res.active = !res.active
                    this.storage.set(id, res).then(
                        res => {
                        }
                    )
                }
            }
        )
    }

    /**
     * DEV METHOD
     * Prints users storage to console
     */
    printStorage() {
        this.storage.forEach(
            (key, value, iteration) => {
                console.log(key)
            }
        )
    }

    /**
     * Gets the users prefered interests and concatenates theminto a API URL friendly string
     * Used to generate a list of nearby items based on category in the users feed
     * e.g. User likes eat-drink and going-out   ==>    return "eat-drink,going-out"
     */
    getQueryString() {
        let query = ''
        return this.storage.forEach(
            (key, value, iteration) => {
                if (key.active) {
                    query += (value + ',')
                }
            }
        ).then(
            () => {
                return query
            }
        )
    }

    /**
     * Generate array with time based chips for user to choose from
     * This would be more sophisticated in a larger scale app
     */
    timeBasedChips() {
        // Time Based
        let hour : number = new Date().getHours();
        let chips = []

        // Recommend Food
        if (hour > 6 && hour < 10) {
            chips.push(
                {
                    title: "Breakfast",
                    icon: CategoryIcons["eatdrink"],
                    id: "eat-drink"
                }
             )
        }
        if (hour > 4 && hour < 11) {
            chips.push({title: "Coffee & Tea", icon: CategoryIcons["coffeetea"], id: "coffee-tea", active:false})
        }
        if (hour > 10 && hour < 14) {
             chips.push({title: "Lunch", icon: CategoryIcons["eatdrink"], id: "eat-drink", active:false})
        }
        if (hour > 14 && hour < 16) {
            chips.push({title: "Snacks", icon: CategoryIcons["eatdrink"], id: "eat-drink", active:false})
        }
        if (hour > 16 && hour < 22) {
            chips.push({title: "Dinner", icon: CategoryIcons["eatdrink"], id:"eat-drink", active:false})
        }
        if (hour > 21 || hour < 4) {
            chips.push({title:"Late Night Snack", icon: CategoryIcons["eatdrink"], id:"eat-drink", active:false})
        }

        // Entertainment
        if (hour > 20 || hour < 4) {
            chips.push({title: "Nightlife", icon: CategoryIcons["goingout"], id: "going-out", active:false})
        }
        if (hour > 8 && hour < 17) {
            chips.push({title:"Outdoors", icon:CategoryIcons["leisureoutdoor"], id:"leisure-outdoor", active:false})
        }
        if (hour > 17 && hour < 23) {
            chips.push({title:"Accommodation", icon:CategoryIcons["accommodation"], id:"accommodation", active:false})
        }
        if (hour > 10 && hour < 16) {
            chips.push({title:"Shopping", icon:CategoryIcons["shopping"], id:"shopping", active:false})
        }
        if (hour > 9 && hour < 17) {
            chips.push({title:"Banking/ATM", icon:CategoryIcons["atmbankexchange"], id:"atm-bank-exchange", active:false})
        }
        if (hour > 10 && hour < 18) {
            chips.push({title:"Popular Sights", icon:CategoryIcons["sightsmuseums"], id:"sights-museums", active:false})
        }
        return chips
    }

}
