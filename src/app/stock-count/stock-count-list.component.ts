import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockMovsService } from '../../services/stock-movs.service';
import { List as ListReq, Filter } from '../../models/request/list';
import { List as ListRes } from '../../models/response/list';
import { StockCount } from '../../models/response/stock-counts';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { fromEvent, Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './stock-count-list.component.html'
})

export class StockCountListComponent implements AfterViewInit {

  private LIST_BATCH_SIZE: number = 15;

  public showPrevious: boolean;

  public showNext: boolean;

  public totalList: number;

  public perPage: number;

  public currentPage: number;

  public totalPages: number;

  public stockCounts: Array<StockCount>;

  public storedReq: ListReq;

  constructor(private notificationService: NotificationService, private service: StockMovsService, private router: Router, ) { }

  ngOnInit() {
    this.showPrevious = false;
    this.showNext = true;

    // load stock movements list with first 15 items
    let req = new ListReq(this.LIST_BATCH_SIZE, 1, "ProductCode","normal");
    this.fetchList(req);
  }

  ngAfterViewInit() {
    const searchBox = document.getElementById('search-box');

    const typeahead = fromEvent(searchBox, 'input').pipe(
      map((e: KeyboardEvent) => (<HTMLInputElement>event.target).value),
      filter(text => text.length > 2),
      debounceTime(10),
      distinctUntilChanged(),
      switchMap(search => {
        let filter = new Filter("ProductCode", search);
        let req = new ListReq(this.LIST_BATCH_SIZE, 1,"ProductCode","normal", filter);
        return Observable.of(this.fetchList(req));
      })
    );
    // start search box type handling 
    typeahead.subscribe(
      () => {}, // success do nothing
      ((error: HttpErrorResponse) => {
        console.log(error)
        this.notificationService.error(error.message);
      })
    );
  }


  public fetchList(req: ListReq): void {
    this.storedReq = req;
    this.service.listStockCount(req)
      .subscribe(
        (list: ListRes) => {
          this.totalList = list.total;
          this.perPage = list.per_page;
          this.currentPage = list.page;
          this.totalPages = Math.ceil(this.totalList / this.perPage);

          // fill component with stock movements
          this.stockCounts = new Array<StockCount>();
          list.items.map((item: any) => {
            let stockCount = <StockCount>item;
            this.stockCounts.push(stockCount);
          }, this);

          // show previous and show next buttons logic
          this.showPrevious = this.currentPage >= 2;
          this.showNext = this.totalPages > this.currentPage;
        },
        ((error: HttpErrorResponse) => {
          console.log(error)
          this.notificationService.error(error.message);
        })
      );
  }

  public loadPrev(): boolean {
    if(!this.showPrevious) {
      return false;
    }
    let pageNumber = this.currentPage - 1 <= 1 ? 1 : this.currentPage - 1;
    this.storedReq.page = pageNumber;
    this.fetchList(this.storedReq);
  }

  public loadNext(): boolean {
    if(!this.showNext) {
      return false;
    }
    let pageNumber = this.currentPage + 1 <= this.totalPages ? this.currentPage + 1 : this.currentPage;
    this.storedReq.page = pageNumber;
    this.fetchList(this.storedReq);
  }

  public listIsEmpty(): boolean {
    return !(this.stockCounts.length > 0)
  }

  public doNothing() {
    return false;
  }
}
