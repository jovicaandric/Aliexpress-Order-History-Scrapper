import { DateFilterPipe } from './../../pipes/date-filter.pipe';
import { DateFilterType } from './shared/dateFilterType';
import { predefinedDateFilters } from './shared/predefinedDateFilters';
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
  public copyOfInitialOrders = [];
  public filteredOrders = [];
  public countryFilter = '';
  public dateFilter: Date;
  public dateFilterView : Date;
  public loading = false;
  public ordersReverse = true;
  public quantityReverse = true;
  public currentSort = 'orders';
  public dateFilters = predefinedDateFilters;
  public dateFilterType = DateFilterType.equals;
  public chosenPredefinedFilter = -1;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
  }

  getOrders() {
    this.ordersReverse = true;
    this.quantityReverse = true;
    this.currentSort = 'orders'
    this.loading = true;
  //  this.clearFilters();
    let prodId = this.searchService.extractID(this.url);
    this.searchService.getNumberOfPages(prodId).subscribe((res: any) => {
     // console.log(res);
      let noOfPages = res.page.total;
      this.searchService.getOrders(noOfPages, prodId).subscribe(result => {
        let data = [];
        //console.log(result);
        //spoj rezultate
        data = data.concat(...result.map(el => {
          return el.records;
        }));


        //mapiraj i zameni countryCode sa imenom
        data = data.map(order => {
          if (order.countryCode == 'uk')
            order.countryCode = 'gb';
          else if(order.countryCode == 'ks')
            order.countryCode = 'srb';
          let length = order.countryCode.length;
          let cn = order.countryCode;
          if (length == 2)
            cn = iso.whereAlpha2(order.countryCode);
          else if (length == 3)
            cn = iso.whereAlpha3(order.countryCode);

          if(!cn)
            cn = {
              country:order.countryCode
            }
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

        // //grupisi po zemlji
        data = _.chain(data)
          .groupBy('countryName')
          .toPairs()
          .map(function (ci) {
            return _.zipObject(['countryName', 'order'], ci);
          })
          .value();
        this.orders = data;
        this.filteredOrders = data;
        this.copyOfInitialOrders = _.cloneDeep(data);
        this.sortByTotalOrders();
        this.loading = false;
        console.log(this.orders);
      });
    });
  }
  clearFilters() {
    console.log('usao');
    this.countryFilter = '';
    this.dateFilter = null;
    this.dateFilterView = null;
    this.chosenPredefinedFilter = -1;
    this.orders = _.cloneDeep(this.copyOfInitialOrders);
    this.filteredOrders = _.cloneDeep(this.copyOfInitialOrders);
    this.sortByTotalOrders();
  }

  calculateQuantity(order): number {
    let sum = 0.0;
    order.order.forEach(element => {
      sum += parseFloat(element.quantity);
    });
    //this.orders[i].totalQuantity = sum;
    return sum;
  }

  sortByTotalOrders() {
    this.orders = _.orderBy(this.filteredOrders,[function(o){return o.order.length}],[this.ordersReverse?'desc':'asc']);
    this.ordersReverse = !this.ordersReverse;
    this.currentSort = 'orders';
  }

  sortByTotalQuantity() {
    //console.log("sortiram");
    this.orders = _.orderBy(this.filteredOrders,[(o)=>{return this.calculateQuantity(o)}],[this.quantityReverse?'desc':'asc']);
    this.quantityReverse = !this.quantityReverse;
    this.currentSort = 'quantity';
  }

  changeDate(){
    this.dateFilter = this.dateFilterView;
    this.dateFilterType = DateFilterType.equals;
    this.chosenPredefinedFilter = -1;
    this.filteredOrders = new DateFilterPipe().transform(this.orders,this.dateFilter,this.dateFilterType);
  }

  filterPredefinedDate(ind, milis){
    this.chosenPredefinedFilter = ind;
    this.dateFilterView = null;
    this.dateFilter = new Date(Date.now() - milis);
    this.dateFilter.setHours(0,0,0,0);
    this.dateFilterType = DateFilterType.lessThan;
    this.filteredOrders = new DateFilterPipe().transform(this.orders,this.dateFilter,this.dateFilterType);
  }

}
