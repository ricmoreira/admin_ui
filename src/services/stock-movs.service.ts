import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockMovCreate as ReqStockMov } from '../models/request/stock-movs';
import { StockMov as RespStockMov } from '../models/response/stock-movs';
import { List as ReqList} from '../models/request/list';
import { List as ResList} from '../models/response/list';
import { Configs } from '../assets/config';
import { Router } from "@angular/router";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class StockMovsService {

  private _stockMovUrl: string;

  constructor(private http: HttpClient, private router: Router, private _authService: AuthenticationService) {
    this._stockMovUrl = `${Configs.admin_api}${Configs.admin_api_stocks}/movement`;
  }

  /**
  * Creates a Stock Movement
  * @param req - Stock Movement Create request
  */
  create(req: ReqStockMov): Observable<RespStockMov> {
    return this.http.post<RespStockMov>(this._stockMovUrl, req, { headers: this._authService.getAdminAPIRequestHeaders() });
  }

  /**
  * Lists Stock Movements
  * @param req - List request
  */
  list(req: ReqList): Observable<ResList> {
    let url = this._stockMovUrl + `?page=${req.page}&per_page=${req.per_page}`
    return this.http.get<ResList>(url, { headers: this._authService.getAdminAPIRequestHeaders() });
  }
}