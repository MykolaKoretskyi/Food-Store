import {FoodForRequest} from "../food/food-for-request";

export class CartItemFood {
  food!: FoodForRequest;
  quantity!: number;

  constructor(food: FoodForRequest, quantity: number) {
    this.food = food;
    this.quantity = quantity;
  }

}
