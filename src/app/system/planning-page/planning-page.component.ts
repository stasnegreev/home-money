import { Component, OnInit } from '@angular/core';
import { combineLatest, timer } from 'rxjs';

import {BillService} from "../shared/services/bill.service";
import {CategoriesService} from "../../shared/services/categories.service";
import {EventsService} from "../shared/services/events.service";
import {Bill} from "../shared/models/bill.model";
import {Category} from "../../shared/models/category.model";
import {WFMEvent} from "../shared/models/event.model";

@Component({
  selector: 'wfm-planning-page',
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.scss']
})
export class PlanningPageComponent implements OnInit {

  isLoaded = false;
  bill: Bill;
  categories: Category[] = [];
  events: WFMEvent[] = [];

  constructor(
    private billService: BillService,
    private categoriesService: CategoriesService,
    private eventService: EventsService,
  ) { }

  ngOnInit() {
    combineLatest(
      this.billService.getBill(),
      this.categoriesService.getCategories(),
      this.eventService.getEvents(),
    ).subscribe((data: [Bill, Category[], WFMEvent[]]) => {
      [this.bill, this.categories, this.events] = data;
      this.isLoaded = true;
      });
  }

  getCategoryCost(cat: Category) {
    return this.events.reduce((total, e) => {
      if (e.category === cat.id && e.type === 'outcome') {
        total = total + e.amount;
        return total;
      } else {
        return total;
      }
    }, 0);
  }

  private getPercent(cat: Category): number {
    const percent = (100 * this.getCategoryCost(cat)) / cat.capacity;
    return percent > 100 ? 100 : percent;
  }

  getCatPercent(cat: Category): string {
    return this.getPercent(cat) + '%';
  }
  getCatColorClass(cat: Category): string {
    const percent = this.getPercent(cat);
    return +percent < 60 ? 'success' : +percent >= 100 ? 'danger' : 'warning';
  }

}
