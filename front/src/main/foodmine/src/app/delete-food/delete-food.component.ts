import {Component} from '@angular/core';
import {FoodService} from "../services/food/food.service";
import {CartPageStorage} from "../services/cart-page/cart-page-storage";
import {TokenStorage} from "../services/auth/token-storage";
import {FoodIdStorage} from "../services/food/food-id-storage";
import {AuthService} from "../services/auth/auth-service";
import {Router} from "@angular/router";
import {ManagerService} from "../services/manager/manager-service";

@Component({
  selector: 'app-delete-food',
  templateUrl: './delete-food.component.html',
  styleUrls: ['./delete-food.component.css']
})
export class DeleteFoodComponent {

  foodNameForDelete: string = "";
  isStatusForbidden: boolean = true;
  isManager: boolean = false;

  constructor(
    private foodService: FoodService,
    private cartPageStorage: CartPageStorage,
    private tokenStorage: TokenStorage,
    private foodIdStorage: FoodIdStorage,
    private authService: AuthService,
    private managerService: ManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.managerService.setManagerPageIsOpen(false);
  }
  deleteFoodById(): void {

    this.foodService.deleteFoodById(this.foodIdStorage.getId()).subscribe(
      {
        next: (response => {
          this.reloadPage();
        }),
        error: (error => {
          if (error.status == 401) {
            this.authService.refreshToken();
            this.deleteFoodById();
          } else if (error.status == 403) {
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }


  private reloadPage(): void {

    this.router.navigateByUrl('/reload')
    .then(r => {
      this.foodIdStorage.removeId();
      this.router.navigateByUrl('/manager-page')
    });
  }

}
