import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {HomeComponent} from './home/home.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SearchComponent} from './search/search.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TagsComponent} from './tags/tags.component';
import {FoodPageComponent} from './food-page/food-page.component';
import {CartPageComponent} from './cart-page/cart-page.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {RegisterComponent} from './register/register.component';
import {LogInComponent} from './log-in/log-in.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {ManagerPageComponent} from './manager-page/manager-page.component';
import {OrderPageComponent} from './order-page/order-page.component';
import {OrdersTableComponent} from './orders-table/orders-table.component';
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {CdkTableModule} from "@angular/cdk/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ForReloadComponent} from './for-reload/for-reload.component';
import {GeneralCartPageComponent} from './general-cart-page/general-cart-page.component';
import {UserOrdersComponent} from './user-orders/user-orders.component';
import {AddFoodComponent} from './add-food/add-food.component';
import {ChangeFoodComponent} from './change-food/change-food.component';
import {DeleteFoodComponent} from './delete-food/delete-food.component';
import {InfoComponent} from './info/info.component';
import {MatIconModule} from "@angular/material/icon";
import {ExceptionComponent} from './exception/exception.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SearchComponent,
    TagsComponent,
    FoodPageComponent,
    CartPageComponent,
    NotFoundComponent,
    RegisterComponent,
    LogInComponent,
    ManagerPageComponent,
    OrderPageComponent,
    OrdersTableComponent,
    ForReloadComponent,
    GeneralCartPageComponent,
    UserOrdersComponent,
    AddFoodComponent,
    ChangeFoodComponent,
    DeleteFoodComponent,
    InfoComponent,
    ExceptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    CdkTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'en-US'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
