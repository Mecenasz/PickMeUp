/// <reference types="@types/googlemaps" />
import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { PickupPubSubService } from 'src/app/services/pickupPubSub/pickup-pub-sub.service';
import { CarService } from "../../services/car/car.service";

@Component({
  selector: 'pickup-car',
  templateUrl: './pickup-car.component.html',
  styleUrls: ['./pickup-car.component.scss']
})
export class PickupCarComponent {
  @Input() map: google.maps.Map;
  @Input() isPickupRequested: boolean;
  @Input() pickupLocation: google.maps.LatLng
  @Input() destination: string;
  @Input() isRiderPickedUp: boolean;
  public pickupCarMarker: google.maps.Marker;
  public polylinePath: google.maps.Polyline;
  public isCarReady: boolean;

  constructor(
    public carService: CarService,
    private pickupPubSub: PickupPubSubService,

  ) { 
    this.isCarReady = false;
  }

  ngOnChanges() {
    if (this.isRiderPickedUp) {
      this.dropoffCar();
    }
    else {
      if (this.isPickupRequested && !this.isCarReady) {
        // request car
        // this.isCarReady = true;
        // this.toggle.emit(this.isCarReady);
        this.requestCar();
        // this.isCarReady = true;
      }
      else {
        //remove/cancel car
        this.removeCar();
        this.removeCarDirections();
      }
    }
  }

  addCarMarker(position) {
    this.pickupCarMarker = new google.maps.Marker({
      map: this.map,
      position: position,
      // icon: 'person-icon1.png'
    });
    console.log('addcarmarker',this.pickupCarMarker);
    
  }
  
  showDirections(path) {
    this.polylinePath = new google.maps.Polyline({
      path: path,
      strokeColor:'#FF0000',
      strokeWeight: 3
    });
    this.polylinePath.setMap(this.map)
  }

  updateCar(cbDone) {
    this.carService.getPickcupCar().subscribe(async car => {
      console.log('car', car);
      // animate car to next point
      await this.pickupCarMarker.setPosition(car.position);
      console.log(car);
      
      // set direction path for car
      this.polylinePath.setPath(car.path);
      // update arrival time
      this.pickupPubSub.emitArrivalTime(car.time);
      // keep updating car
      if (car.path.length > 1) {
        setTimeout(() => {
          this.updateCar(cbDone);
        }, 1000);
      }
      else {
        // car arrived
        cbDone();
      }
    });
  }

  checkForRiderPickup() {
    this.carService.pollForRiderPickup().subscribe(data => {
      this.pickupPubSub.emitPickup();
    })
  }

  checkForRiderDropoff() {
    this.carService.pollForRiderDropoff().subscribe(data => {
      this.pickupPubSub.emitDropoff();
    })
  }

  requestCar() {
     this.carService.findPickupCar(this.pickupLocation)
      .subscribe(car => {
        console.log('pickup location', this.pickupLocation);
        
        // show car marker
        this.addCarMarker(car.position);
        // show car path/ directions to you
        this.showDirections(car.path);
        // keep updating car
        this.updateCar(() => this.checkForRiderPickup());
    })
  }

  dropoffCar() {
    this.carService.dropoffCar(this.pickupLocation, this.destination)
      .subscribe(car => {
        // keep updating car
        this.updateCar(() => this.checkForRiderDropoff());
      })
  }

  removeCarDirections() {
    if (this.pickupCarMarker) {
      this.pickupCarMarker.setMap(null); 
      this.pickupCarMarker = null;
    }
  }

  removeCar() {
    if (this.polylinePath) {
      this.polylinePath.setMap(null);
    }
  }
}