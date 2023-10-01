import {Food} from "./food";
import {CartPageStorage} from "../services/cart-page/cart-page-storage";

export class CartItem {
  constructor(food: Food, private cartPageStorage: CartPageStorage) {
    this.food = food;
    this.setQuantity();
  }

  food: Food;
  quantity: number = 1;

  public getPrice(): number {
    let quantity: number = this.cartPageStorage.getQuantityById(this.food.id.toString());
    return this.food.price * quantity;
  }

  public setQuantity(): void {
    this.quantity = this.cartPageStorage.getQuantityById(this.food.id.toString());
  }

}
