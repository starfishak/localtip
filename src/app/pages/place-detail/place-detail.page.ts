import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  pageinfo = null;

  constructor(private activatedRoute: ActivatedRoute, private PlacesService: PlacesService) { }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    this.PlacesService.getDetails(id).subscribe(result => {
      console.log('result: ', result);
      this.pageinfo = result;
    })
  }

}
