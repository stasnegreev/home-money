import { Component, OnInit } from '@angular/core';
import { Category } from '../../shared/models/category.model';
import { CategoriesService } from '../../shared/services/categories.service';

@Component({
  selector: 'wfm-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.scss']
})
export class RecordsPageComponent implements OnInit {
  categories: Category[] = [];
  isLoaded = false;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.categoriesService.getCategories()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
        console.log(`records-page-comp categories = ${categories}`);
        this.isLoaded = true;
      })
  }

  newCategoryAdded(category: Category){
    this.categories.push(category);
  }

  categoryWasEdited(category: Category){
    const idx = this.categories.map(c => {
      if (c.id === category.id) { return category; }
      return c;
    });
  }
}
