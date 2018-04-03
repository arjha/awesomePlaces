import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController, normalizeURL, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, Entry, FileError } from '@ionic-native/file';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { PlacesService } from '../../services/places.service';
import { Scan } from '../../models/scan';

declare var cordova: any;

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
  scanData: Scan = {
    format: '',
    text: ''
  };
  barcodeStatus: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private modalCntrl: ModalController, private gLocation: Geolocation,
    private loadingCntrl: LoadingController, private toastCntrl: ToastController,
    private camera: Camera, private placeServices: PlacesService, private file: File,
    private alertCntrl: AlertController, private barcode: BarcodeScanner) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlacePage');
  }

  onSubmit(form: NgForm) {
    this.placeServices.addPlace(form.value.title, form.value.description,
      this.location, this.imageURL, this.scanData);
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
      quality: 90,
      allowEdit: true,
      correctOrientation: false,
    }
    this.camera.getPicture(options).then((imageData) => {
      const currentName = imageData.replace(/^.*[\\\/]/, '');
      const path = imageData.replace(/[^\/]*$/, '');;
      let d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";

      this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
        .then(
          (data: Entry) => {
            this.imageURL = data.nativeURL;
            this.camera.cleanup();

          }
        )
        .catch(
          (err: FileError) => {
            this.imageURL = '';
            const toast = this.toastCntrl.create({
              message: err.message,
              duration: 2500
            });
            toast.present();
            this.camera.cleanup();
          }
        );
      this.imageURL = imageData;
    }, (err) => {
      const toast = this.toastCntrl.create({
        message: 'Some error occoured---other',
        duration: 2500
      });
      toast.present();
    });


  }

  scanCode() {
    this.barcode.scan({
      prompt: "Scan your QR/Barcode",
      showTorchButton: true,
      disableSuccessBeep: false
    }).then((barcodeData) => {

      this.scanData.format = barcodeData.format;
      this.scanData.text = barcodeData.text;
      this.barcodeStatus = barcodeData.cancelled;

    }, (err) => {
      console.log("ERROR -> " + JSON.stringify(err));
    });
  }
}
