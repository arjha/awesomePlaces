import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { PlacesService } from '../../services/places.service';


@IonicPage({
  priority: "low"
})
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location: Location = {
    lat: 22.5726,
    lng: 88.3639
  };
  locationIsSet: boolean = false;
  imageURL: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private modalCntrl: ModalController, private gLocation: Geolocation,
    private loadingCntrl: LoadingController, private toastCntrl: ToastController,
    private camera: Camera, private placeServices: PlacesService, private file:File) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlacePage');
  }

  onSubmit(form: NgForm) {
    this.placeServices.addPlace(form.value.title, form.value.description,
      this.location, this.imageURL);
    form.reset();
    this.location = {
      lat: 22.5726,
      lng: 88.3639
    };
    this.imageURL = "";
    this.locationIsSet = false;
  }

  onOpenMap() {
    const mapModal = this.modalCntrl.create(SetLocationPage,
      { location: this.location, isSet: this.locationIsSet });
    mapModal.present();
    mapModal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          this.locationIsSet = true;
        } else {
          return;
        }
      }
    );
  }

  onLocate() {
    const loader = this.loadingCntrl.create({
      content: 'Getting your location...'
    });
    if (!this.locationIsSet) {
      loader.present();
    }


    this.gLocation.getCurrentPosition().then((resp) => {
      loader.dismiss();
      this.location.lat = resp.coords.latitude;
      this.location.lng = resp.coords.longitude;
      this.locationIsSet = true;
    }).catch((error) => {
      loader.dismiss();
      const errToast = this.toastCntrl.create({
        message: 'Error in finding your locaiton',
        duration: 3000
      });
      errToast.present();
      console.log('Error getting location', error);
    });

    let watch = this.gLocation.watchPosition();
    watch.subscribe((data) => {

      this.locationIsSet = true;
      this.location.lat = data.coords.latitude;
      this.location.lng = data.coords.longitude;
    },
      error => {

      });

  }

  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      this.imageURL = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.error(err)
    });
  }
}
