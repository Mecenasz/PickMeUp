import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { share } from 'rxjs/operators';
import { SimulateBackendService } from '../simulateBackend/simulate-backend.service';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  public simulate: SimulateBackendService;

  constructor() {
    this.simulate = new SimulateBackendService(); 
  }

  pollForRiderPickup() {
    return this.simulate.riderPickedUp();
  }

  dropoffCar(pickupLocation, dropoffLocation) {
    return this.simulate.dropoffPickupCar(pickupLocation, dropoffLocation)
  }

  pollForRiderDropoff() {
    return this.simulate.riderDroppedoff();
  }

  getPickupCarDriverInfo() {
    return this.simulate.getPickupCarDriverInfo();
  }  

  getPickcupCar() {
    return this.simulate.getPickupCar();
  }

  findPickupCar(pickupLocation) {
    return this.simulate.findPickupCar(pickupLocation);
  }

  async getCars() {

    return await interval(2000)
    .pipe(
      switchMap(() => this.simulate.getCars())
    )
    .pipe(
      share()
    );
  }
}
