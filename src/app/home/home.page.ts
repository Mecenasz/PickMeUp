import { Component, ViewChild} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DriverInfoComponent } from '../components/driver-info/driver-info.component';
import { PickupPubSubService } from "../services/pickupPubSub/pickup-pub-sub.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('driver-info') driverInfo: DriverInfoComponent;
  
  public isPickupRequested: boolean;
  public pickupSubscription: any;
  public isRiderPickedUp: boolean;
  public timeTillArrival: number;
  public destination: String;
  public isPopupShowed: boolean;
  

  constructor(
    private pickupPubSub: PickupPubSubService,
    public alertCtrl: AlertController,
    ) {
    this.isPickupRequested = false;
    this.timeTillArrival = 5;
    this.isRiderPickedUp = false;
    
    this.pickupSubscription = this.pickupPubSub.watch().subscribe(e => {
      this.processPickupSubscription(e);
    })
  }

  setDestination(destination) {
    this.destination = destination;
  }
  
  processPickupSubscription(e) {
    switch(e.event) {
      case this.pickupPubSub.EVENTS.ARRIVAL_TIME:
        this.updateArrivalTime(e.data);
        break;
      case this.pickupPubSub.EVENTS.PICKUP:
        this.riderPickedUp();
        break;
      case this.pickupPubSub.EVENTS.DROPOFF:
        this.riderDroppedOff();
        break;
    }
  }

  riderPickedUp() {
    this.isRiderPickedUp = true;
  }

  async rateDriver() {
    let prompt = await this.alertCtrl.create({
      header: 'Rate Driver',
      message: 'Select a rating for your driver',
      inputs: [{
        type: 'radio',
        label: 'Perfect',
        value: 'perfect',
        checked: true
      },
      {
        type: 'radio',
        label: 'Okay',
        value: 'okay',
      },
      {
        type: 'radio',
        label: 'Horrible',
        value: 'horrible',
      }],
      buttons:[{
        text: 'Submit',
        handler: rating => {
          // TODO: sennd rating to server 
        }
      }]

    })
    await prompt.present();
  }

  riderDroppedOff() {
    this.rateDriver();
    this.isRiderPickedUp = false;
    this.isPickupRequested = false;
    this.destination = null
    this.timeTillArrival = 5;
  }

  updateArrivalTime(seconds) {
    let minutes = Math.floor(seconds/60);
    this.timeTillArrival = minutes;
    console.log('time till arrival', this.timeTillArrival);
  }

  confirmPickUp() {
    this.isPickupRequested = true;
    this.driverInfo.showPopup();
  }

  cancelPickUp() {
    this.isPickupRequested = false;
  }
}
