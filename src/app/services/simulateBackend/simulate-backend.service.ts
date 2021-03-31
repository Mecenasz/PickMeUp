/// <reference types="@types/googlemaps" />
import { Injectable } from '@angular/core';
import { observable, Observable, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimulateBackendService {
  public google: any;
  public directionService: google.maps.DirectionsService;
  public myRoute: any;
  public myRouteIndex: number;
  public driverInfo: string;
  public pickupCar: any;

  constructor() {

    this.directionService = new google.maps.DirectionsService();
    this.pickupCar = this.cars[Math.floor(Math.random() * 5)].cars[Math.floor(Math.random() * 2)];
  }

  riderPickedUp() {
    // simulate rider pickedup
    return timer(1000)
  }

  riderDroppedoff() {
    // simulate rider dropped off after one second
    return timer(10000)
  }

  getPickupCar() { 
    return Observable.create(observable => {
      let car = this.myRoute[this.myRouteIndex]
      observable.next(car)
      this.myRouteIndex++;
    })
  }

  getSegmentedDirections(directions) {
    
    let route = directions.routes[0];
    let legs = route.legs;
    let path = [];
    let increments = [];
    let duration = 0;
    let numOfLegs = legs.length;

    while (numOfLegs--) {
      let leg = legs[numOfLegs];
      let steps = leg.steps;
      let numOfSteps = steps.length;

      while (numOfSteps--) {
        let step = steps[numOfSteps];
        let points = step.path;
        let numOfPoints = points.length;
        
        duration += step.duration.value;

        while (numOfPoints--) {
          
          let point = points[numOfPoints]

          path.push(point);

          increments.unshift({
            position: point, // car position
            time: duration, // time left before arrival
            path: path.slice(0) // clone array to prevent referencing final path array
          })
        }
      }
    }
    return increments;
  }
  
  calculateRoute(start, end) {
    return Observable.create(observable => {
      this.directionService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.TRANSIT
      }, (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          observable.next(response)
        } else {
          observable.error(status)
        }
      })
    })
  }

  simulateRoute(start, end) {
    
    return Observable.create(observable => {
      this.calculateRoute(start, end).subscribe(directions => {
        // get route path
        this.myRoute = this.getSegmentedDirections(directions);
        // return pickup car 
        this.getPickupCar().subscribe(car => {
          observable.next(car); // first increment in car path
        })
      })
    });
  }

  getPickupCarDriverInfo() {
    return this.pickupCar.driver
  }

  findPickupCar(pickupLocation) {
    this.myRouteIndex = 0;
    let start = new google.maps.LatLng(this.pickupCar.coord.lat, this.pickupCar.coord.lng);
    let end = pickupLocation;

    return this.simulateRoute(start, end);
  }

  dropoffPickupCar(pickupLocation, dropoffLocation) {
    return this.simulateRoute(pickupLocation, dropoffLocation);
  }

  getCars() {
  
    let carData = this.cars[this.carIndex];
    this.carIndex++;
    
    if (this.carIndex > this.cars.length-1) {
      this.carIndex = 0;
    }

    return Observable.create(
      observer => observer.next(carData)
    )
  }

  private carIndex: number = 0;

  private cars1 = {
    cars: [{
      id: 1,
      coord: {
        lat: -33.454120,
        lng: -70.690721
      },
      driver: {
        nombre: "Wolfgang Amadeus Mozart",
        imgURL: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Wolfgang-amadeus-mozart_1.jpg"
      }
    },
    {
      id: 2,
      coord: {
        lat: -33.455010, 
        lng: -70.690519
      },
      driver: {
        nombre: "Johan Sebastian Bach",
        imgURL: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Wolfgang-amadeus-mozart_1.jpg"
      }
    }]
  };

  private cars2 = {
    cars: [{
      id: 1,
      coord: {
        lat: -33.453578, 
        lng: -70.690862
      },
      driver: {
        nombre: "Ludwig Van Beethoven",
        imgURL: "http://sites.coloradocollege.edu/musicengraving/files/2015/02/beethoven.jpg"
      }
    },
    {
      id: 2,
      coord: {
        lat: -33.454348, 
        lng: -70.692407
      },
      driver: {
        nombre: "kenzo Tenma",
        imgURL: "http://images5.fanpop.com/image/photos/31800000/Dr-Tenma-dr-tenma-31823345-640-480.jpg"
      }
    }]
  };

  private cars3 = {
    cars: [{
      id: 1,
      coord: {
        lat: -33.453954, 
        lng: -70.691592
      },
      driver: {
        nombre: "Ludwig Van Beethoven",
        imgURL: "http://sites.coloradocollege.edu/musicengraving/files/2015/02/beethoven.jpg"
      }
    },
    {
      id: 2,
      coord: {
        lat: -33.455091, 
        lng: -70.691903
      },
      driver: {
        nombre: "Levi Ackerman",
        imgURL: "https://i.pinimg.com/originals/00/62/fe/0062fe3c80e8d2ede11e4c5f57032b68.png"
      }
    }]
  };

  private cars4 = {
    cars: [{
      id: 1,
      coord: {
        lat: -33.453480, 
        lng: -70.691259
      },
      driver: {
        nombre: "Johan Liebert",
        imgURL: "https://i.pinimg.com/originals/b8/47/84/b847840637b035f0a00f80c990b8bec4.jpg"
      }
    },
    {
      id: 2,
      coord: {
        lat: -33.453310, 
        lng: -70.692452
      },
      driver: {
        nombre: "Antonio Vivaldi",
        imgURL: "https://www.plusesmas.com/pictures/biografias/6000/6109.jpg"
      }
    }]
  };

  private cars5 = {
    cars: [{
      id: 1,
      coord: {
        lat: -33.453366, 
        lng: -70.689104
      },
      driver: {
        nombre: "Franz Lizst",
        imgURL: "https://www.singers.com/people/images/FranzLiszt.jpg"
      }
    },
    {
      id: 2,
      coord: {
        lat: -33.452317, 
        lng: -70.691159
      },
      driver: {
        nombre: "Joseph Joestar",
        imgURL: "https://cdn.myanimelist.net/images/characters/11/398513.jpg"
      }
    }]
  };

  private cars: Array<any> = [this.cars1, this.cars2, this.cars3, this.cars4, this.cars5];
  
}
