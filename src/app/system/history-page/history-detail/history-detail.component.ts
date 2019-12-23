import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {EventsService} from "../../shared/services/events.service";
import {CategoriesService} from "../../../shared/services/categories.service";
import {mergeMap} from "rxjs/operators";
import {WFMEvent} from "../../shared/models/event.model";
import {Category} from "../../../shared/models/category.model";

@Component({
  selector: 'wfm-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit {

  event: WFMEvent;
  category: Category;

  isLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    private categoryService: CategoriesService
  ) { }


  ngOnInit() {
    this.route.params.pipe(
      mergeMap((params: Params) => this.eventService.getEventById(params.id))
    ).pipe(
      mergeMap((event: WFMEvent) => {
        this.event = event;
        return this.categoryService.getCategoryById(event.category);
      })
    )
      .subscribe((category: Category) => {
        this.category = category
        this.isLoaded = true;
    });
  }



}
