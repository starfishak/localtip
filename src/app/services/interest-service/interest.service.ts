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
                console.log(res)
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
        console.log("Default profile set")
    }

    /**
     * DEV METHOD
     * Clear local storage for testing
     */
    clearStorage() {
        this.storage.clear()
    }

    /**
     * Gets the users preference list
     */
    getPreferenceList() {
        console.log("called")
        this.preference_list = []

        return this.storage.forEach(
            (key, value, iteration) => {
                this.preference_list.push(key)
            }
        )
        //     .then(
        //     (res) => {
        //         return this.preference_list
        //     },
        //     () => {
        //         console.log("rejected")
        //         return this.error_message
        //     }
        // )
    }

    /**
     * Toggle the interest provided
     * @param id for the interest e.g. eat-drink
     */
    toggleInterest(id : string) {
        this.storage.get(id).then(
            res => {
                res.active = !res.active
                this.storage.set(id, res).then(
                    res => {
                        console.log("Done")
                    }
                )
            }
        )
    }

    printStorage() {
        this.storage.forEach(
            (key, value, iteration) => {
                console.log(key)
            }
        )
    }

    /**
     * Generate array with time based chips for user to choose from
     */
    timeBasedChips() {
        // Time Based
        let hour : number = new Date().getHours();
        let chips = []
            // Recommend Food
        if (hour > 6 && hour < 10) {
            chips.push(["Breakfast", CategoryIcons["eatdrink"]])
        }
        if (hour > 4 && hour < 11) {
            chips.push(["Coffee & Tea", CategoryIcons["coffeetea"]])
        }
        if (hour > 10 && hour < 14) {
             chips.push(["Lunch", CategoryIcons["eatdrink"]])
        }
        if (hour > 14 && hour < 16) {
            chips.push(["Snacks", CategoryIcons["eatdrink"]])
        }
        if (hour > 16 && hour < 21) {
            chips.push(["Dinner", CategoryIcons["eatdrink"]])
        }
        if (hour > 21 || hour < 4) {
            chips.push(["Late Night Snack", CategoryIcons["eatdrink"]])
        }

        // Entertainment
        if (hour > 20 || hour < 4) {
            chips.push(["Nightlife", CategoryIcons["goingout"]])
        }
        if (hour > 8 && hour < 17) {
            chips.push(["Outdoors", CategoryIcons["leisureoutdoor"]])
        }
        if (hour > 17 && hour < 21) {
            chips.push(["Accommodation", CategoryIcons["accommodation"]])
        }
        if (hour > 10 && hour < 16) {
            chips.push(["Shopping", CategoryIcons["shopping"]])
        }
        if (hour > 9 && hour < 17) {
            chips.push(["Banking/ATM", CategoryIcons["atmbankexchange"]])
        }
        if (hour > 10 && hour < 18) {
            chips.push(["Popular Sights", CategoryIcons["sightsmuseums"]])
        }
        return chips
    }

}
