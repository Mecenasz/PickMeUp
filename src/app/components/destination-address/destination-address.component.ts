import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'destination-address',
  templateUrl: './destination-address.component.html',
  styleUrls: ['./destination-address.component.scss'],
})
export class DestinationAddressComponent {
  @Output() newDest: EventEmitter<string> = new EventEmitter();

  public enteredAddress: string;
  public geocoder: google.maps.Geocoder;
  public results: Array<any>;
  public isDestinationSet: boolean;

  constructor() {
    this.enteredAddress = "";
    this.geocoder = new google.maps.Geocoder();
    this.results = [];
    this.isDestinationSet;
  }

  onSubmit() {
    this.results = [];

    this.geocoder.geocode( {address: this.enteredAddress}, (destinations, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        this.results = destinations.slice(0, 4);
      }
      else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
        alert("destination not found");
      }
    });
  }

  selectDestination(destination) {    
    this.results = [];
    this.enteredAddress = destination.formatted_address;
    // pass the destination lat/lng to the parent
    this.newDest.next(destination.geometry.location);
    this.isDestinationSet = true;
  }
}