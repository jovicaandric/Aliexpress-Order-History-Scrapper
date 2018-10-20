import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import * as _ from 'lodash';
import * as iso from 'iso-3166-1';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public url = '';//'https://www.aliexpress.com/item/Aluminum-Vertical-Laptop-Stand-Thickness-Adjustable-Desktop-NoteBooks-Holder-Erected-Space-saving-Stand-for-MacBook-Pro/32888439976.html?spm=2114.search0104.3.10.6a4014d5mf5tzr&ws_ab_test=searchweb0_0,searchweb201602_4_10065_10068_318_319_5727317_10696_450_10084_10083_10618_452_535_534_533_10307_532_204_10059_10884_10887_100031_320_10103_448_5727217_449,searchweb201603_60,ppcSwitch_0&algo_expid=9970d922-e6b0-450f-a1b6-461997256294-1&algo_pvid=9970d922-e6b0-450f-a1b6-461997256294&priceBeautifyAB=0';
  public orders = [];
  public countryFilter = '';
  public dateFilter: Date;
  public loading = false;
  constructor(private searchService: SearchService) { }

  ngOnInit() {
  }

  getOrders() {
    this.loading = true;
    this.clearFilters();
    let prodId = this.searchService.extractID(this.url);
    this.searchService.getNumberOfPages(prodId).subscribe((res: any) => {
      console.log(res);
      let noOfPages = res.page.total;
      this.searchService.getOrders(noOfPages, prodId).subscribe(result => {
        let data = [];
        //spoj rezultate
        data = data.concat(...result.map(el => {
          return el.records;
        }));

        
        //mapiraj i zameni countryCode sa imenom
        data = data.map(order => {
          if (order.countryCode == 'uk')
            order.countryCode = 'gb';
          let cn = iso.whereAlpha2(order.countryCode);
          if (!cn)
            cn = iso.whereAlpha3(order.countryCode);
          return {
            id: order.id,
            country: order.countryCode,
            countryName: cn.country,
            quantity: order.quantity,
            date: Date.parse(order.date)
          }
        });

        //izbaci duplikate
        data = _.uniqBy(data, (e) => {
          return e.id;
        });
        
        //grupisi po zemlji
        data = _.chain(data)
          .groupBy('countryName')
          .toPairs()
          .map(function (ci) {
            return _.zipObject(['countryName', 'order'], ci);
          })
          .value();
        this.orders = data;
        this.loading = false;
        console.log(this.orders);
      });
    });

    // .subscribe(res => {
    //   
    //   this.orders = res
    //   this.allOrders = res
    //   this.backup = _.cloneDeep(res);
    //   //console.log(res);
    // })
  }
  clearFilters() {
    this.countryFilter = '';
    this.dateFilter = null;
  }

  calculateQuantity(order): number {
    let sum = 0.0;
    order.order.forEach(element => {
      sum += parseFloat(element.quantity);
    });
    return sum;
  }

}
