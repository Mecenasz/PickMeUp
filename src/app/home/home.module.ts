import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { DestinationAddressComponent } from "../components/destination-address/destination-address.component";
import { MapModule } from "../components/map/map.module";
import { DriverInfoComponent } from "../components/driver-info/driver-info.component";
import { PriceComponent } from "../components/price/price.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MapModule
  ],
  declarations: [HomePage, DestinationAddressComponent, DriverInfoComponent, PriceComponent]
})
export class HomePageModule {}