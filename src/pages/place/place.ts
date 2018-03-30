import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Place } from '../../models/place';


@IonicPage()
@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {
  place: Place;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCntrl: ViewController, ) {
    this.place = this.navParams.get('place');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacePage');
  }

  back(a: string = "bk") {
    this.viewCntrl.dismiss({ isDel: a });
  }

  delete() {
    this.back('del');
  }

}
