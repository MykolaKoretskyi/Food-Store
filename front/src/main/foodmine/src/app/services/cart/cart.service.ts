import {Injectable} from '@angular/core';
import {Cart} from "../../models/cart";
import {Food} from "../../models/food";
import {CartItem} from "../../models/cartitem";
import {CartPageStorage} from "../cart-page/cart-page-storage";
import {TokenStorage} from "../auth/token-storage";
import {CartPageService} from "../cart-page/cart-page.service";
import {FoodService} from "../food/food.service";
import {AuthService} from "../auth/auth-service";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: Cart;

  constructor(
    private tokenStorage: TokenStorage,
    private cartPageService: CartPageService,
    private cartPageStorage: CartPageStorage,
    private foodService: FoodService,
    private authService: AuthService
  ) {
    this.cart = new Cart(
      tokenStorage,
      cartPageService,
      cartPageStorage,
      foodService,
      authService
    );
  }

  addToCart(food: Food): void {

    let cartItem: CartItem | undefined = this.cart.getItems().find(item => item.food.id === food.id);

    let id: string = food.id.toString();
    let quantityFood: number = this.cartPageStorage.getQuantityById(id);
    if (cartItem) {
      this.cartPageStorage.changeQuantitySelectedFood(id, (quantityFood + 1).toString());
      cartItem.setQuantity();
      return;
    }
    this.cartPageStorage.changeQuantitySelectedFood(food.id.toString(), "1");
    this.cart.getItems().push(new CartItem(food, this.cartPageStorage));
  }

  removeFromCart(foodId: number): void {

    this.cartPageStorage.removeFoodFromCart(foodId.toString());
    this.cart.setItems();
  }

  changeQuantity(foodId: number, quantity: number): void {

    this.cartPageStorage.changeQuantitySelectedFood(foodId.toString(), quantity.toString())
    let cartItem: CartItem | undefined = this.cart.getItems().find(item => item.food.id === foodId);
    if (!cartItem) {
      return;
    }
    cartItem.setQuantity();
  }

  getCart(): Cart {
    return this.cart;
  }

}
