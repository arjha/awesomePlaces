import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddPlacePage } from '../add-place/add-place';
import { Place } from '../../models/place';
import { PlacesService } from '../../services/places.service';
import { PlacePage } from '../place/place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  addPlacePage: any = AddPlacePage;
  places: Place[] = [];
  constructor(public navCtrl: NavController, private placesService: PlacesService,
    private modalCntrl: ModalController) {

  }

  ionViewWillEnter() {
    this.places = this.placesService.loadPlace();
  }

  openPlace(place: Place, index:number) {
    const modal = this.modalCntrl.create(PlacePage, { place: place });
    modal.present();
    modal.onDidDismiss(data => {
      if (data.isDel === "del") {
        this.placesService.deletePlace(index);
        this.ionViewWillEnter();
      }
    });
  }

}
