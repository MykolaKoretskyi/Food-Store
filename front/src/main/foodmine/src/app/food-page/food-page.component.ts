import {Component, OnInit} from '@angular/core';
import {Food} from "../models/food";
import {ActivatedRoute, Router} from "@angular/router";
import {FoodService} from "../services/food/food.service";
import {CartService} from "../services/cart/cart.service";
import {CartPageService} from "../services/cart-page/cart-page.service";
import {TokenStorage} from "../services/auth/token-storage";
import {AuthService} from "../services/auth/auth-service";
import {FoodIdStorage} from "../services/food/food-id-storage";

@Component({
  selector: 'app-food-page',
  templateUrl: './food-page.component.html',
  styleUrls: ['./food-page.component.css']
})
export class FoodPageComponent implements OnInit {

  food!: Food;
  isStatusForbidden: boolean = true;
  isManager!: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private cartService: CartService,
    private idStorage: FoodIdStorage,
    private cartPageService: CartPageService,
    private tokenStorage: TokenStorage,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.isStatusForbidden = this.tokenStorage.getAccessToken() == null;
    this.isManager = this.tokenStorage.getAuthorities().includes("MANAGER");
    this.extractFoodById();
  }

  extractFoodById(): void {

    console.log("FoodPageComponentExtractFoodById");

    this.foodService.getFoodById(this.idStorage.getId()).subscribe(
      {
        next: (response => {
          this.food = response;
        }),
        error: (error => {
          if (error.status == 401) {
            console.log("Refresh !");
            this.authService.refreshToken();
            this.extractFoodById();
          } else if (error.status == 403) {
            this.isStatusForbidden = true;
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }


  addToCart(): void {
    this.cartService.addToCart(this.food);
    this.cartPageService.setCartPageIsOpen(true);
    this.router.navigateByUrl('/cart-page');
  }


  public changeFavoriteStatus(): void {
    this.food.favorite = !this.food.favorite;
    this.changeAndGetStatusFavorite();
  }


  private changeAndGetStatusFavorite(): void {

    this.foodService.changeAndGetStatusFavorite(this.food).subscribe(
      {
        next: (response => {
          this.food = response;
        }),
        error: (error => {
          if (error.status == 401) {
            console.log("Refresh !");
            this.authService.refreshToken();
            this.changeAndGetStatusFavorite();
          } else if (error.status == 403) {
            this.isStatusForbidden = true;
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }

}
