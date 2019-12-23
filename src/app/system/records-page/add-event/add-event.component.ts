import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';
import { mergeMap } from 'rxjs/operators';

import {Category} from '../../../shared/models/category.model';
import {WFMEvent} from '../../shared/models/event.model';
import {EventsService} from '../../shared/services/events.service';
import {BillService} from '../../shared/services/bill.service';
import {Bill} from '../../shared/models/bill.model';
import {Message} from "../../../shared/models/message.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'wfm-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {

  sub1: Subscription;
  sub2: Subscription;

  @Input() categories: Category[] = [];
  types = [
    {type: 'income', label: 'Доход'},
    {type: 'outcome', label: 'Расход'}
  ];
  message: Message;

  constructor(
    private eventsService: EventsService,
    private billService: BillService,
    ) { }

  ngOnInit() {
    this.message = new Message('danger', '');
  }

  showMessage(text: string) {
    this.message.text = text;
    window.setTimeout(() => this.message.text = '', 5000);
  }

  onSubmit(form: NgForm) {
    let {amount, descripion, category, type} = form.value;
    if (amount < 0 ) {
      amount *= -1;
    }
    const event = new WFMEvent(
      type,
      amount,
      +category,
      moment().format('DD.MM.YYYY HH.mm.ss'),
      descripion
    );

    this.sub1 = this.billService.getBill()
      .subscribe((bill: Bill) => {
        console.log('bill=', bill);
        if (type === 'outcome') {
          if (amount > bill.value) {
            console.log('amount>bill');
            this.showMessage(`No money вам не хватает ${amount - bill.value}`);
            return;
          } else {
            console.log('amount<bill');
            console.log('bill befor=', bill.value);
            bill.value -= amount;
            console.log('bill after=', bill.value);
          }
        } else {
          bill.value += amount;
        }
        this.sub2 = this.billService.updateBill(bill).pipe(
          mergeMap(() => this.eventsService.addEvent(event)))
          .subscribe(() => {
            console.log('addEvent');
            form.setValue({
              amount: 0,
              type: 'outcome',
              description: ' ',
              category: 1,
            });
            form.onReset();
          });
      });
//
  }

  ngOnDestroy(): void {
    if (this.sub1) this.sub1.unsubscribe();
    if (this.sub2) this.sub2.unsubscribe();
  }
}
