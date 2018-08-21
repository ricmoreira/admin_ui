import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StockMovsService } from '../../services/stock-movs.service';
import { List as ListReq } from '../../models/request/list';
import { List as ListRes } from '../../models/response/list';
import { StockMov } from '../../models/response/stock-movs';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: './stock-movs.component.html'
})

export class StockMovsComponent {

  private LIST_BATCH_SIZE: number = 15;

  public showPrevious: boolean;

  public showNext: boolean;

  public totalList: number;

  public perPage: number;

  public currentPage: number;

  public totalPages: number;

  public stockMovs: Array<StockMov>

  constructor(private notificationService: NotificationService, private service: StockMovsService, private router: Router, ) { }

  ngOnInit() {
    this.showPrevious = false;
    this.showNext = true;

    // load stock movements list with first 15 items
    let req = new ListReq(this.LIST_BATCH_SIZE, 1);
    this.fetchList(req);
  }

  public fetchList(req: ListReq): void {
    this.service.list(req)
      .subscribe(
        (list: ListRes) => {
          this.totalList = list.total;
          this.perPage = list.per_page;
          this.currentPage = list.page;
          this.totalPages = Math.ceil(this.totalList / this.perPage);

          // fill component with stock movements
          this.stockMovs = new Array<StockMov>();
          list.items.map((item: any) => {
            let stockMov = <StockMov>item;
            this.stockMovs.push(stockMov);
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

  public loadPrev(): void {
    let pageNumber = this.currentPage - 1 <= 1 ? 1 : this.currentPage - 1;
    let req = new ListReq(this.LIST_BATCH_SIZE, pageNumber);
    this.fetchList(req);
  }

  public loadNext(): void {
    let pageNumber = this.currentPage + 1 <= this.totalPages ? this.currentPage + 1 : this.currentPage;
    let req = new ListReq(this.LIST_BATCH_SIZE, pageNumber);
    this.fetchList(req);
  }

  public listIsEmpty(): boolean {
    return !(this.stockMovs.length > 0)
  }
}
