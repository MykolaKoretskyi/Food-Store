import {CartItem} from "./cartitem";
import {TokenStorage} from "../services/auth/token-storage";
import {CartPageService} from "../services/cart-page/cart-page.service";
import {CartPageStorage} from "../services/cart-page/cart-page-storage";
import {FoodService} from "../services/food/food.service";
import {AuthService} from "../services/auth/auth-service";

export class Cart {
  private items: CartItem[] = [];


  constructor(
    private tokenStorage: TokenStorage,
    private cartPageService: CartPageService,
    private cartPageStorage: CartPageStorage,
    private foodService: FoodService,
    private authService: AuthService
  ) {
  }

  get totalPrice(): number {
    let totalPrice: number = 0;
    this.items.forEach(item => {
      totalPrice += item.getPrice();
    });
    return totalPrice;
  }

  public getItems(): CartItem[] {
    return this.items;
  }

  public setItems(): void {

    let listId: string [] = this.cartPageStorage.getSelectedFoodsId();
    if (listId.length != 0) {
      this.extractFoodsByListId(listId);
      return;
    }
    this.items = [];
  }


  private extractFoodsByListId(foodsListId: Array<string>): void {

    this.foodService.getFoodsByListId(foodsListId).subscribe(
      {
        next: (response => {
          this.items = response.map(food =>
            new CartItem(food, this.cartPageStorage));
        }),
        error: (error => {
          if (error.status == 401) {
            this.authService.refreshToken();
            this.extractFoodsByListId(foodsListId);
          } else if (error.status == 403) {
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }


}

