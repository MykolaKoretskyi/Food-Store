import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {FoodPageComponent} from "./food-page/food-page.component";
import {LogInComponent} from "./log-in/log-in.component";
import {RegisterComponent} from "./register/register.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {ManagerPageComponent} from "./manager-page/manager-page.component";
import {ForReloadComponent} from "./for-reload/for-reload.component";
import {GeneralCartPageComponent} from "./general-cart-page/general-cart-page.component";
import {AddFoodComponent} from "./add-food/add-food.component";
import {ChangeFoodComponent} from "./change-food/change-food.component";
import {DeleteFoodComponent} from "./delete-food/delete-food.component";
import {ExceptionComponent} from "./exception/exception.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'reload', component: ForReloadComponent},
  {path: 'food', component: FoodPageComponent},
  {path: 'cart-page', component: GeneralCartPageComponent},
  {path: 'log-in', component: LogInComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'manager-page', component: ManagerPageComponent},
  {path: 'add-food', component: AddFoodComponent},
  {path: 'change-food', component: ChangeFoodComponent},
  {path: 'delete-food', component: DeleteFoodComponent},
  {path: 'exception', component: ExceptionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
