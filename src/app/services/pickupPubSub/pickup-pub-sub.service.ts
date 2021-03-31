import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { share } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PickupPubSubService {
  public pickup$: Observable<any>;
  private _observer: Observer<any>;

  public EVENTS = {
    PICKUP: 'pickup',
    DROPOFF: 'dropoff',
    ARRIVAL_TIME: 'arrival'
  };

  constructor() {
    this.pickup$ = new Observable(observer => {
      this._observer = observer;
    })
    .pipe(
      share() // share allows multiple subscribers
    );
  }

  watch() {
    return this.pickup$;
  }

  emitArrivalTime(time) {
    this._observer.next({
      event: this.EVENTS.ARRIVAL_TIME,
      data: time
    })
  }

  emitPickup() {
    this._observer.next({
      event: this.EVENTS.PICKUP,
      data: null
    })
  }

  emitDropoff() {
    this._observer.next({
      event: this.EVENTS.DROPOFF,
      data: null
    })
  }
}
