import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';

import {Category} from '../../../shared/models/category.model';
import {Message} from '../../../shared/models/message.model';
import {CategoriesService} from '../../../shared/services/categories.service';


@Component({
  selector: 'wfm-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Output() onCategoryEdit = new EventEmitter<Category>();

  currentCategoryId = 1;
  currentCategory: Category;
  category: Category;
  massage: Message;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.onCategoryChange();
    this.massage = new Message('success', '');
  }

  onCategoryChange() {
    this.currentCategory = this.categories.find(c => c.id === +this.currentCategoryId);
  }
  onSubmit(form: NgForm) {
    console.log('editCategory form.value=', form.value);
    let capacity = form.value.capacity;
    let name = form.value.name;
    if (capacity < 0) { capacity *= -1; }
    console.log('editCategory name, capacity, +this.currentCategoryId=',name, capacity, +this.currentCategoryId);
    const category = new Category(name, capacity, +this.currentCategoryId);
    console.log('editCategory category=', category);
    this.categoriesService.upDateCategories(category)
      .subscribe(
        (categories: Category) => {
        this.onCategoryEdit.emit(categories)
        this.massage.text = 'Already edded';
        window.setTimeout(() => this.massage.text='', 3000);
      });
  }

}
