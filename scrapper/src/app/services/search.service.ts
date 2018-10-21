import { Injectable } from '@angular/core';
import { Observable, forkJoin, from, of } from 'rxjs';
import { bufferCount, concatMap, catchError, mergeAll, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public url = "/getOrders"

  constructor(private http: HttpClient) { }

  getNumberOfPages(prodId): Observable<any> {
    return this.http.get(this.createUrl(prodId, 1));//.subscribe((res : any) => {
    //  return res.data.page.total;
    // });
  }


  createUrl(productID, page): string {
    return 'https://feedback.aliexpress.com/display/evaluationProductDetailAjaxService.htm?productId=' + productID + '&type=default&page=' + page;
  }

  extractID(url) {
    let test = url.split('.html')[0].split(/[\-\_\/\.\,\*]+/);
    let id = test[test.length - 1]
    return id;
  }

  getOrders(noOfPages, prodId): Observable<any> {

    let allcalls = [];
    let tr = 0;
    let br = 50;

    if(noOfPages < 50)
      br = noOfPages;

    if(noOfPages <=25)
      br = noOfPages * 2;

    for (var j = 1; j <= br; j++) {
      allcalls.push(this.http.get(this.createUrl(prodId, ++tr)).pipe(
        catchError(this.handleError('getHeroes', []))
      ));
    }

   return forkJoin(...allcalls);
    // return this.http.get(environment.endPoint + "/getOrders?url=" + orderUrl);

  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      console.error(error);
      return of(error);
    };
  }
}
