import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { List as ListReq } from '../../models/request/list';
import { List as ListRes } from '../../models/response/list';
import { Product } from '../../models/response/products';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: './products.component.html'
})

export class ProductsComponent {

  private PRODUCTS_BATCH_SIZE: number = 15;

  public showPrevious: boolean;
  public showNext: boolean;

  public totalProducts: number;

  public perPage: number;

  public currentPage: number;

  public totalPages: number;

  public products: Array<Product>

  constructor(private notificationService: NotificationService, private service: ProductsService, private router: Router, ) { }

  ngOnInit() {
    this.showPrevious = false;
    this.showNext = true;

    // load products list with first 15 products
    let req = new ListReq(this.PRODUCTS_BATCH_SIZE, 1);
    this.fetchProducts(req);
  }

  public fetchProducts(req: ListReq): void {
    this.service.listProducts(req)
      .subscribe(
        (list: ListRes) => {
          this.totalProducts = list.total;
          this.perPage = list.per_page;
          this.currentPage = list.page;
          this.totalPages = Math.ceil(this.totalProducts / this.perPage);

          // fill component with products
          this.products = new Array<Product>();
          list.items.map((item: any) => {
            let product = <Product>item;
            this.products.push(product);
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

  public loadPrevProducts(): void {
    let pageNumber = this.currentPage - 1 <= 1 ? 1 : this.currentPage - 1;
    let req = new ListReq(this.PRODUCTS_BATCH_SIZE, pageNumber);
    this.fetchProducts(req);
  }

  public loadNextProducts(): void {
    let pageNumber = this.currentPage + 1 <= this.totalPages ? this.currentPage + 1 : this.currentPage;
    console.log(pageNumber);
    let req = new ListReq(this.PRODUCTS_BATCH_SIZE, pageNumber);
    this.fetchProducts(req);
  }

  public listIsEmpty(): boolean {
    return !(this.products.length > 0)
  }
}
