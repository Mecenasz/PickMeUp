import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss'],
})
export class PriceComponent implements OnInit {
  @Input() isPickupRequested: boolean;
  @Input() destination: string;

  constructor() { }

  ngOnInit() {}

  ngOnChanges() {


  }

}
