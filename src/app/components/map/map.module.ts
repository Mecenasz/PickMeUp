import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickupComponent } from "../pickup/pickup.component";
import { MapComponent } from "./map.component";
import { AvailableCarsComponent } from "../available-cars/available-cars.component";
import { PickupCarComponent } from "../pickup-car/pickup-car.component";
import { CarService } from "../../services/car/car.service";

@NgModule({
  declarations: [PickupComponent, MapComponent, AvailableCarsComponent, PickupCarComponent],
  imports: [CommonModule],
  exports: [MapComponent, PickupComponent, AvailableCarsComponent, PickupCarComponent, CarService],
  providers: [CarService]
})
export class MapModule { }
