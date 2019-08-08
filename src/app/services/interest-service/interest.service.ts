import { Injectable } from '@angular/core';
import {Categories} from 'src/categories';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class InterestService {
    userCategories: any;

    constructor(private storage : Storage) { }

    initUserInterest() {
        // set a key/value
        this.storage.set('name', 'Test');
        //going-out,sights-museums,transport
        this.storage.get('name').then((val) => {
            console.log('Your age is', val);
        });
    }

    /**
     * Generate array with time based chips for user to choose from
     */
    static timeBasedChips() {
        // Time Based
        let hour : number = new Date().getHours();
        let chips = []
            // Recommend Food
        if (hour > 6 && hour < 10) {
            chips.push(["Breakfast", Categories["eatdrink"]])
        }
        if (hour > 4 && hour < 11) {
            chips.push(["Coffee & Tea", Categories["coffeetea"]])
        }
        if (hour > 10 && hour < 14) {
            chips.push(["Lunch", Categories["eatdrink"]])
        }
        if (hour > 14 && hour < 16) {
            chips.push(["Snacks", Categories["eatdrink"]])
        }
        if (hour > 16 && hour < 21) {
            chips.push(["Dinner", Categories["eatdrink"]])
        }
        if (hour > 21 || hour < 4) {
            chips.push(["Late Night Snack", Categories["eatdrink"]])
        }

        // Entertainment
        if (hour > 20 || hour < 4) {
            chips.push(["Nightlife", Categories["goingout"]])
        }
        if (hour > 8 && hour < 17) {
            chips.push(["Outdoors", Categories["leisureoutdoor"]])
        }
        if (hour > 17 && hour < 21) {
            chips.push(["Accommodation", Categories["accommodation"]])
        }
        if (hour > 10 && hour < 16) {
            chips.push(["Shopping", Categories["shopping"]])
        }
        if (hour > 9 && hour < 17) {
            chips.push(["Banking/ATM", Categories["atmbankexchange"]])
        }
        if (hour > 10 && hour < 18) {
            chips.push(["Popular Sights", Categories["sightsmuseums"]])
        }
        return chips
    }

}
