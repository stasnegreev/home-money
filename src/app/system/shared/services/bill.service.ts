import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Bill} from '../models/bill.model';
import {map} from 'rxjs/operators';
import {BaseApi} from '../../../shared/core/base-api';

@Injectable()

export class BillService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }
  getBill(): Observable<Bill> {
    return this.get('bill');
  }

  updateBill(bill: Bill): Observable<Bill>{
    return this.put(`bill`, bill);
  }
  //getBill(): Observable<Bill> {
  //  return this.http.get(`http://localhost:3000/bill`, {responseType: 'json'}).pipes(
  //      map(
  //        (bill: Bill) => bill
  //      )
  //    );
  // }
  getCurrency(base: string = 'RUB'): Observable<any> {
    return this.get('currencyEx');
    //return this.http.get(`https://data.fixer.io/api/latest?base=${base}`, {responseType: 'json'}).pipes(
    //  map(
    //    (currency) => currency
    //  )
    //);
  }
}
