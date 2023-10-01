import {Component} from '@angular/core';
import {TokenStorage} from "../services/auth/token-storage";
import {FoodService} from "../services/food/food.service";
import {AuthService} from "../services/auth/auth-service";

@Component({
  selector: 'app-general-cart-page',
  templateUrl: './general-cart-page.component.html',
  styleUrls: ['./general-cart-page.component.css']
})
export class GeneralCartPageComponent {
  isLoggedIn: boolean = false;
  isManager: boolean = false;
  isOrderData: boolean = false;

  constructor(
    private tokenStorage: TokenStorage,
    private foodService: FoodService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorage.getAccessToken() != null;
    this.isManager = this.tokenStorage.getAuthorities().includes("MANAGER");
    this.getOrdersForUser();
  }


  private getOrdersForUser(): void {

    this.foodService.getOrdersForUser().subscribe(
      {
        next: (response => {
          if (response) {
            this.isOrderData = response.length > 0;
          }
        }),
        error: (error => {
          if (error.status == 401) {
            this.authService.refreshToken();
            this.getOrdersForUser();
          } else if (error.status == 403) {
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }

}
