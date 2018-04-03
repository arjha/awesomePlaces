import { Location } from "./location";
import { Scan } from "./scan";

export class Place {
    constructor(public title: string, public description: string,
        public location: Location, public imageUrl: string, public scan:Scan) { }
}