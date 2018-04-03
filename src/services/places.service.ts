import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';

import { Place } from "../models/place";
import { Location } from "../models/location";
import { Injectable } from '@angular/core';
import { Scan } from '../models/scan';


@Injectable()
export class PlacesService {
    private places: Place[] = [];

    constructor(private storage: Storage, private file: File) { }


    addPlace(title: string, description: string, location: Location, imageUrl: string,scan:Scan) {
        const place = new Place(title, description, location, imageUrl,scan);
        this.places.push(place);
        this.storage.set('places', this.places)
            .then()
            .catch(
                err => {
                    this.places.splice(this.places.indexOf(place), 1);
                }
            );
    }

    loadPlace() {
        console.log(this.places.slice())
        return this.places.slice();
    }

    fetchStorage() {
        return this.storage.get('places')
            .then(
                (places: Place[]) => {
                    this.places = places !== null ? places : [];
                    return this.places;
                }
            )
            .catch(
                err => {
                    console.log(err);
                }
            );
    }

    deletePlace(index: number) {
        const place = this.places[index];
        this.places.splice(index, 1);
        this.storage.set('places', this.places)
            .then(
                () => {
                    this.removeFile(place);
                }
            )
            .catch(
                err => {
                    console.log('del----------------' + this.places)
                }
            );

    }
    private removeFile(place: Place) {
        const currentName = place.imageUrl.replace(/^.*[\\\/]/, '');
        this.file.removeFile(this.file.dataDirectory, currentName)
            .then(
                () => {
                    console.log('removed file')
                }
            ).catch(
                (err) => {
                    console.log('error while removing file');
                    this.addPlace(place.title, place.description, place.location, place.imageUrl,place.scan);
                }
            );
    }

}