import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Location } from '../../models/location';

/**
 * Generated class for the SetLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {
  location: Location;
  lat: number;
  lng: number;
  marker: Location;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCntrl: ViewController) {
    this.location = this.navParams.get('location');
    this.lat = this.location.lat;
    this.lng = this.location.lng;
    if(this.navParams.get('isSet')){
     this.marker=this.location;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetLocationPage');
  }

  onSetMarker(ev: any) {
    console.log(ev);
    this.marker = new Location(ev.coords.lat, ev.coords.lng);
  }

  closeSelectMarker() {
    this.viewCntrl.dismiss({location: this.marker});
  }

  closeMap() {
    this.viewCntrl.dismiss();
  }

}
