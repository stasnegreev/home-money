import { Component, OnInit } from '@angular/core';
import { combineLatest } from "rxjs";
import * as moment from "moment";

import {CategoriesService} from "../../shared/services/categories.service";
import {EventsService} from "../shared/services/events.service";
import {WFMEvent} from "../shared/models/event.model";
import {Category} from "../../shared/models/category.model";

@Component({
  selector: 'wfm-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit {

  constructor(
    private categoriesService: CategoriesService,
    private eventService: EventsService
  ) { }
  isLoaded = false;

  categories: Category[] = [];
  events: WFMEvent[] = [];
  filteredEvents: WFMEvent[] = [];
  charData = [];
  isFilterVisible = false;

  ngOnInit() {
    combineLatest(
      this.eventService.getEvents(),
      this.categoriesService.getCategories()
    ).subscribe((data: [ WFMEvent[], Category[]]) => {
        this.events = data[0];
        this.categories = data[1];
        this.setOrinalEvents();
        this.calculateCharData();
        console.log('filteredEvents=', this.filteredEvents);
        this.isLoaded = true;
      }
    )

  }

  setOrinalEvents() {
    this.filteredEvents = this.events.slice();
  }

  calculateCharData():void {
    this.charData = [];
    this.categories.forEach((cat) => {
      const totalEvent = this.filteredEvents.reduce((total, e) => {
        if (e.category === cat.id && e.type === 'outcome') {
          total = total + e.amount;
          return total;
        } else {
          return total;
        }
      }, 0);
      this.charData.push({
        name: cat.name,
        value: totalEvent,
      });
    });
  }

  private toggleFilterVisibility(dir: boolean) {
    this.isFilterVisible = dir;
  }

  openFilter() {
    this.toggleFilterVisibility(true);
  }

  onFilterApply(filterData) {
    console.log('filterData=', filterData);
    this.toggleFilterVisibility(false);
    this.setOrinalEvents();

    const startPeriod = moment().startOf(filterData.period).startOf('d');
    const endPeriod = moment().endOf(filterData.period).endOf('d');

    this.filteredEvents = this.filteredEvents
      .filter((e) => {
        return filterData.types.indexOf(e.type) !== -1;
      })
      .filter((e) => {
        return filterData.categories.indexOf(e.category.toString()) !== -1;
      })
      .filter((e) => {
        const momentDate = moment(e.date, 'DD.MM.YYYY HH:mm:ss');
        return momentDate.isBetween(startPeriod, endPeriod);
      });
    console.log('filteredEvents=', this.filteredEvents);
    this.calculateCharData();
  }

  onFilterCancel() {
    this.toggleFilterVisibility(false);
    this.setOrinalEvents();
    this.calculateCharData();
  }

}
