import {Component, Input, OnInit} from '@angular/core';
import {WFMEvent} from "../../shared/models/event.model";

@Component({
  selector: 'wfm-history-event',
  templateUrl: './history-event.component.html',
  styleUrls: ['./history-event.component.scss']
})
export class HistoryEventComponent implements OnInit {
  @Input() categories;
  @Input() events;

  searchValue = '';
  searchPlaceholder = 'Сумма';
  searchField = 'amount';

  constructor() { }

  ngOnInit() {
    this.events.forEach((e) => {
      e.catName = this.categories.find(c => c.id === e.category).name;
    });

  }
  getEventClass(e: WFMEvent): any {
    return {
      'label': true,
      'label-danger': e.type === 'outcome',
      'label-success': e.type === 'income'

    }
  }

  changeCriteria(field: string){
    const namesMap = {
      amount: 'Сумма',
      date: 'Дата',
      category: 'Категория',
      type: 'Тип',
    };
    this.searchPlaceholder = namesMap[field];
    this.searchField = field;
  }

}
