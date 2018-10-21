import { DateFilterType } from '../components/search/shared/dateFilterType';
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'dateFilter'
})
export class DateFilterPipe implements PipeTransform {

  transform(orders: any, dateFilter?: any, dateFilterType?: DateFilterType): any {
    //console.log(orders);
    let rez = _.cloneDeep(orders);
    if (dateFilter) {
      rez.forEach((e, i) => {
        rez[i].order = e.order.filter((el, index, array) => {

          let d = new Date(el.date);
          d.setHours(0, 0, 0, 0);
          if (dateFilterType == DateFilterType.lessThan)
            return d.getTime() >= dateFilter.getTime();
          else
            return d.getTime() == dateFilter.getTime();
        })
      });
    }
    return rez;
  }

}
