import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuardService as AuthGuard } from './../services/auth-guard.service';

// Import components
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { P404Component } from './404/404.component';
import { P500Component } from './500/500.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductsComponent } from './products/products.component';
import { SAFTComponent } from './saft/saft.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { StockMovsComponent } from './stock-movs/stock-movs.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'company-info/detail',
        component: CompanyInfoComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Company Info'
        }
      },
      {
        path: 'products/list',
        component: ProductsComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Products'
        }
      },
      {
        path: 'stock/movement/list',
        component: StockMovsComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Stock Movements'
        }
      },
      {
        path: 'invoices/list',
        component: InvoicesComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Invoices'
        }
      },
      {
        path: 'saft/upload',
        component: SAFTComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'SAFT'
        }
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
