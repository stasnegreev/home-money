import {Component, EventEmitter, Input, Output} from '@angular/core';

import {Category} from '../../../shared/models/category.model';

@Component({
  selector: 'wfm-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent {

  @Output() onFilterCancel = new EventEmitter<any>();
  @Output() onFilterApply = new EventEmitter<any>();

  @Input() categories: Category[] = [];

  timePeriods = [
    {type: 'd', lable: 'Day'},
    {type: 'w', lable: 'Week'},
    {type: 'M', lable: 'Month'},
  ];

  selectedPeriod = 'w';
  selectedTypes = [];
  selectedCategories = [];

  types = [
    {type: 'income', lable: 'Доход'},
    {type: 'outcome', lable: 'Расход'},
  ];

  closeFilter() {
    this.onFilterCancel.emit();
    this.selectedTypes = [];
    this.selectedCategories = [];
    this.selectedPeriod = 'd';
    this.onFilterCancel.emit();
  }

  private calculateInputParams(field: string, value: string, checked: boolean) {
    if (checked) {
      this[field].indexOf(value) === -1 ? this[field].push(value) : null;
    } else {
      this[field] = this[field].filter((i) => i !== value);
    }
    console.log('this.', field, '= ', this[field]);
  }

  handleChangeType({checked, value}) {
    this.calculateInputParams('selectedTypes', value, checked);
  }

  handleChangeCategory({checked, value})  {
    this.calculateInputParams('selectedCategories', value, checked);
  }

  applyFilter() {
    this.onFilterApply.emit({
      types: this.selectedTypes,
      categories: this.selectedCategories,
      period: this.selectedPeriod,
    });
  }
}
