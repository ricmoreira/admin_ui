import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InvoicesService } from '../../services/invoices.service';
import { List as ListReq } from '../../models/request/list';
import { List as ListRes } from '../../models/response/list';
import { Invoice } from '../../models/response/invoices';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: './invoices.component.html'
})

export class InvoicesComponent {

  private INVOICES_BATCH_SIZE: number = 15;

  public showPrevious: boolean;
  public showNext: boolean;

  public totalInvoices: number;

  public perPage: number;

  public currentPage: number;

  public totalPages: number;

  public invoices: Array<Invoice>

  constructor(private notificationService: NotificationService, private service: InvoicesService, private router: Router, ) { }

  ngOnInit() {
    this.showPrevious = false;
    this.showNext = true;

    // load invoices list with first 15 invoices
    let req = new ListReq(this.INVOICES_BATCH_SIZE, 1);
    this.fetchList(req);
  }

  public fetchList(req: ListReq): void {
    this.service.listInvoices(req)
      .subscribe(
        (list: ListRes) => {
          this.totalInvoices = list.total;
          this.perPage = list.per_page;
          this.currentPage = list.page;
          this.totalPages = Math.ceil(this.totalInvoices / this.perPage);

          // fill component with invoices
          this.invoices = new Array<Invoice>();
          list.items.map((item: any) => {
            let invoice = <Invoice>item;
            this.invoices.push(invoice);
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
    let req = new ListReq(this.INVOICES_BATCH_SIZE, pageNumber);
    this.fetchList(req);
  }

  public loadNext(): void {
    let pageNumber = this.currentPage + 1 <= this.totalPages ? this.currentPage + 1 : this.currentPage;
    let req = new ListReq(this.INVOICES_BATCH_SIZE, pageNumber);
    this.fetchList(req);
  }

  public listIsEmpty(): boolean {
    return !(this.invoices.length > 0)
  }
}
