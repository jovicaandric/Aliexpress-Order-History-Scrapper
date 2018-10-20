import { Order } from './../models/Order';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public url = "/getOrders"

  constructor(private http: HttpClient) { }

   getNumberOfPages(prodId) :Observable<any> {
    return this.http.get(this.createUrl(prodId, 1));//.subscribe((res : any) => {
    //  return res.data.page.total;
   // });
  }


  createUrl(productID, page):string {
    return 'https://feedback.aliexpress.com/display/evaluationProductDetailAjaxService.htm?productId=' + productID + '&type=default&page=' + page;
  }

  extractID(url) {
    let test = url.split('.html')[0].split(/[\-\_\/\.\,\*]+/);
    let id = test[test.length - 1]
    return id;
  }

  getOrders(noOfPages, prodId):Observable<any>{

      let allcalls = [];
      let tr = 0;

    for (var j = 1; j <= noOfPages * 2; j++) {
      allcalls.push(this.http.get(this.createUrl(prodId,++tr)));
    }  
    return forkJoin(...allcalls);
 
   // return this.http.get(environment.endPoint + "/getOrders?url=" + orderUrl);

  }
}
