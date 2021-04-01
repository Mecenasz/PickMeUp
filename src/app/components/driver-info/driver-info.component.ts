import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { CarService } from "../../services/car/car.service";

@Component({
  selector: 'driver-info',
  templateUrl: './driver-info.component.html',
  styleUrls: ['./driver-info.component.scss'],
})
export class DriverInfoComponent implements OnInit {
  @Input() isPickupRequested: boolean;
  public isPopupShowed: boolean;

  public driverInfo: any;


  constructor(
    public carService: CarService
  ) {
    this.isPopupShowed = false;
  }

  ngOnInit() {}

  ngOnChanges() {
    if (this.isPickupRequested) {
      this.showDriverInfo();
      this.showPopup()
    }
    else {

    }
  }

  showDriverInfo() {
    this.driverInfo = this.carService.getPickupCarDriverInfo();
    return this.driverInfo;
  }
  showPopup() {    
    this.isPopupShowed = true;
  }
  closePopup() {    
    this.isPopupShowed = false;
  }
}