/// <reference types="@types/googlemaps" />
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';
import { CarService } from "../../services/car/car.service";
import { PickupCarComponent } from '../pickup-car/pickup-car.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [CarService]
})
export class MapComponent implements OnInit {
  @ViewChild('pickupCar') pickupCar: ElementRef;  
  @Input() isPickupRequested: boolean;
  @Input() destination: string;
  @Input() isRiderPickedUp: boolean;

  public mapData: google.maps.Map;
  public isMapIdle: boolean;
  public currentLocation: google.maps.LatLng;

  constructor(
    private geolocation: Geolocation
  ) { }
  ionViewDidLoad() {
    this.pickupCar.nativeElement;
  }
  async ngOnInit() {
    console.log(this.pickupCar);
       
    this.createMap();
    this.addMapEventListeners();
    
    this.getCurrentLocation().subscribe(location =>{
      this.centerLocation(location);
    });
  }

  updatePickupLocation(location) {
    this.currentLocation = location;
    this.centerLocation(location);
  }

  addMapEventListeners() {
    google.maps.event.addListener(this.mapData, 'dragstart', () => {
      this.isMapIdle = false;
    });
    google.maps.event.addListener(this.mapData, 'idle', () => {
      this.isMapIdle = true;
    });
  }

  createMap(location = new google.maps.LatLng(47.8095, 13.0550)) {    
    const mapOptions = {
      center: location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP as google.maps.MapTypeId,
      disableDefaultUI: true
    }
    const mapEl = document.getElementById('map')
    this.mapData = new google.maps.Map(mapEl, mapOptions)
  }

  getCurrentLocation() {

    let options = {timeout: 200000, enableHighAccuracy: true}

    let locationObs = Observable.create(observable => {

      this.geolocation.getCurrentPosition(options)
        .then(resp => {
          let lat = resp.coords.latitude;
          let lng = resp.coords.longitude;
          
          let location_place = new google.maps.LatLng(lat, lng)
          
          observable.next(location_place);

        }).catch(err => {
          console.log('Error getting location', err);
        });
        
    });
    return locationObs;
  }

  centerLocation(location) {
    if(location) {
      this.mapData.panTo(location);
    }
    else {
      this.getCurrentLocation().subscribe(currentLocation => {
        this.mapData.panTo(currentLocation);
      })
    }
  }
}