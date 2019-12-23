import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import {BaseApi} from "../core/base-api";
import {Category} from "../models/category.model";

@Injectable()
export class CategoriesService extends BaseApi{

  constructor(http: HttpClient){
    super(http);
  }

  addCategory(category: Category): Observable<Category> {
    console.log(`categories-service categories = ${this.post('categories', category)}`);
    return this.post('categories', category);
  }

  getCategories(): Observable<Category[]> {
    console.log(`categories-service categories = ${this.get('categories')}`);
    return this.get('categories');
  }

  upDateCategories(category: Category): Observable<Category> {
    console.log('categoryService put category=', category, 'url=', `categories/${category}`);

    return this.put(`categories/${category.id}`, category);
  }
  getCategoryById(id: number): Observable<Category> {
    return this.get(`categories/${id}`);
  }

}
