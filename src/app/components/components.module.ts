import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from "./map/map.component";
import { PickupComponent } from "./pickup/pickup.component";

@NgModule({
  declarations: [MapComponent, PickupComponent],
  imports: [CommonModule],
  exports: [MapComponent, PickupComponent]
})
export class ComponentsModule { }
