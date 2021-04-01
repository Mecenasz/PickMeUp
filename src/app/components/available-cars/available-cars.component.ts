import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CarService } from "../../services/car/car.service";

@Component({
  selector: 'available-cars',
  templateUrl: './available-cars.component.html',
  styleUrls: ['./available-cars.component.scss'],
  providers: []
})
export class AvailableCarsComponent implements OnInit {

  @Input() map: google.maps.Map;
  @Input() isPickupRequested: boolean;

  public carMarkers: Array<google.maps.Marker>;  

  constructor(
    public carService: CarService
  ) { 
    this.carMarkers = []
  }

  ngOnInit() {
    this.fetchAndRefreshCars();
  }
  
  ngOnChanges() {
    if (this.isPickupRequested) {
      this.removeCarMarkers();
    }
  }

  removeCarMarkers() {
    let numOfCars = this.carMarkers.length;
    while (numOfCars--) {
      let car = this.carMarkers.pop();
      car.setMap(null);
    }
  }

  addCarMarker(car) {
    let carMarker = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(car.coord.lat, car.coord.lng),
      // icon: {url: 'person-icon1.png'}
    });

    carMarker.set('id', car.id); //MVCObject()

    // carMarker.setDuration(2000);
    // carMarker.setEasing('linear')

    this.carMarkers.push(carMarker);
  }

  updateCarMarker(car) {
    
    for (let i = 0, numOfCars=this.carMarkers.length; i < numOfCars; i++) {
      // find car and update it
      if (this.carMarkers[i].get('id') === car.id) {
        this.carMarkers[i].setPosition(new google.maps.LatLng(car.coord.lat, car.coord.lng));
        return;
      }
    }
    // car does not exist in carMarkers
    this.addCarMarker(car);
  }

  async fetchAndRefreshCars() {
    (await this.carService.getCars())
    .subscribe(carData => {
      if (!this.isPickupRequested) {
        (<any>carData).cars.forEach(car => {
          this.updateCarMarker(car);
        });
      }
    })
  }
}
