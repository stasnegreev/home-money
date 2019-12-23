import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription, combineLatest} from 'rxjs';

import {BillService} from '../shared/services/bill.service';
import {Bill} from '../shared/models/bill.model';

@Component({
  selector: 'wfm-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit, OnDestroy {

  sub1: Subscription;
  sub2: Subscription;

  currency: any;
  bill: Bill;

  isLoaded = false;

  constructor(private billService: BillService) { }

  ngOnInit() {
    // this.sub1 = this.billService.getBill().subscribe(
    //   (bill: Bill) => {
    //     this.bill = bill;
    //     this.isLoaded = true;
    //   }
    // );
    // this.sub12 = this.billService.getCurrency().subscribe(
    //   ((currency: any ) => {
    //     this.currency = currency;
    //     console.log('currency', currency);
    //     }
    //   )
    // );
    this.sub1 = combineLatest(this.billService.getBill(), this.billService.getCurrency())
        .subscribe(
          ([bill, currency]) => {
            this.bill = bill;
            this.currency = currency[0];
            this.isLoaded = true;
          }
        );

  }
  onRefresh() {
    this.isLoaded = false;
    this.sub2 = this.billService.getCurrency()
      .subscribe(
        (currency: any) => {
          this.currency = currency[0];
          this.isLoaded = true;
        }
      );
  }
  ngOnDestroy() {
    this.sub1.unsubscribe();
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }
}
