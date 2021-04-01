/// <reference types="@types/googlemaps" />
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { PickupPubSubService } from 'src/app/services/pickupPubSub/pickup-pub-sub.service';

@Component({
  selector: 'pickup',
  templateUrl: 'pickup.component.html',
  styleUrls: ['pickup.component.scss'],
  providers: []
})
export class PickupComponent implements OnInit, OnChanges {
  @Input() isPinSet: boolean;
  @Input() map: google.maps.Map;
  @Input() isPickupRequested: boolean;
  @Input() destination: string;
  @Input() isRiderPickedUp: boolean;
  @Output() updatedPickupLocation: EventEmitter<google.maps.LatLng> = new EventEmitter();

  private pickupMarker: google.maps.Marker;
  private popup: google.maps.InfoWindow;
  private pickupSubscription: any;

  constructor(
    private pickupPubSub: PickupPubSubService
  ) { }

  ngOnInit() {
    this.pickupSubscription = this.pickupPubSub.watch().subscribe(e => { 
      if (e.event === this.pickupPubSub.EVENTS.ARRIVAL_TIME) {
        this.updateTime(e.data);
      }
    })
  }

  ngOnChanges(changes) {
    console.log(changes);
    
    // do not allow pickup pin/location
    // to change if pickup is requested
    if (!this.isPickupRequested) {
      if (this.isPinSet) {
        this.showPickupMarker();
      }
      else {
        this.removePickupMarker();
      }
    }
    if (this.isRiderPickedUp) {
      this.removePickupMarker();
    }
  }

  async showPickupMarker() {

    this.removePickupMarker();
    
    this.pickupMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.BOUNCE,
      position: this.map.getCenter(),
      icon: 'person-icon.png'
    })

    setTimeout(() => {
      this.pickupMarker.setAnimation(null);
    }, 750)

    this.showPickupTime();

    // send pickup location
    this.updatedPickupLocation.next(this.pickupMarker.getPosition())
  }

  removePickupMarker() {
    if (this.pickupMarker) {
      this.pickupMarker.setMap(null)
    }
  }

  showPickupTime() {
    this.popup = new google.maps.InfoWindow({
      content: '<h5>You Are Here</h5>'
    });

    this.popup.open(this.map, this.pickupMarker);
    google.maps.event.addListener(this.pickupMarker, 'click', () => {
      this.popup.open(this.map, this.pickupMarker);
    });
  }
  updateTime(seconds) {
    let minutes = Math.floor(seconds/60);
    this.popup.setContent(`<h5>${minutes} minutes</h5>`);
  }
  
}