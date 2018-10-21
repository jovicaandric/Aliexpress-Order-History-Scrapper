
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOrders'
})
export class FilterOrdersPipe implements PipeTransform {

  transform(orders: any, countryFilter?:any): any {
    return orders.filter(el => {
      return (el.countryName.toLowerCase().indexOf(countryFilter.toLowerCase()) !== -1 )
    });
  }

}
