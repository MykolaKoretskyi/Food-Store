import {Component} from '@angular/core';
import {TokenStorage} from "../services/auth/token-storage";
import {CartPageStorage} from "../services/cart-page/cart-page-storage";
import {Router} from "@angular/router";
import {FoodIdStorage} from "../services/food/food-id-storage";
import {FoodService} from "../services/food/food.service";
import {IdNameFood} from "../services/food/id-name";
import {AuthService} from "../services/auth/auth-service";
import {ExceptionService} from "../services/exceptions/exception-service";
import {ManagerService} from "../services/manager/manager-service";

@Component({
  selector: 'app-manager-page',
  templateUrl: './manager-page.component.html',
  styleUrls: ['./manager-page.component.css']
})

export class ManagerPageComponent {
  foodNameForChange: string = "";
  foodNameForDelete: string = "";
  isStatusForbidden: boolean = true;
  isManager: boolean = false;

  constructor(
    private foodService: FoodService,
    private cartPageStorage: CartPageStorage,
    private tokenStorage: TokenStorage,
    private foodIdStorage: FoodIdStorage,
    private authService: AuthService,
    private exceptionService: ExceptionService,
    private managerService: ManagerService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.isManager = this.tokenStorage.getAuthorities().includes("MANAGER");
    if (!this.isManager) {
      this.cartPageStorage.removeAll();
      this.router.navigate(['/']);
    }
    this.managerService.setManagerPageIsOpen(true);
    this.isStatusForbidden = this.tokenStorage.getAccessToken() == null;

  }


  changeFoodByName(): void {

    this.foodService.getFoodByName(new IdNameFood(this.foodNameForChange)).subscribe(
      {
        next: (response => {
          if (response.id == null) {
            this.exceptionService.noValidValue(
              "25rem",
              "No food found with the name: \""
              + this.foodNameForChange + "\""
            );
            return;
          }
          this.foodIdStorage.saveId(response.id);
          this.router.navigate(['/change-food']);
        }),
        error: (error => {
          if (error.status == 401) {
            this.authService.refreshToken();
            this.changeFoodByName();
          } else if (error.status == 403) {
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }

  deleteFoodByName(): void {

    this.foodService.getFoodByName(new IdNameFood(this.foodNameForDelete)).subscribe(
      {
        next: (response => {

          if (response.id == null) {
            this.exceptionService.noValidValue(
              "25rem",
              "No food found with the name: \""
              + this.foodNameForDelete + "\""
            );
            return;
          }
          this.foodIdStorage.saveId(response.id);
          this.goToDeletePage();
        }),
        error: (error => {
          if (error.status == 401) {
            this.authService.refreshToken();
            this.deleteFoodByName();
          } else if (error.status == 403) {
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }


  private goToDeletePage(): void {
    this.router.navigateByUrl('/delete-food');
  }

}
