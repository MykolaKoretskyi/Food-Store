import {CartItemFood} from "./cartitem-food";

export class OrderData {

  id: any = null;
  username: string = "";
  itemsFood: CartItemFood[] = [];
  totalPrice: number = 0.0;
  fullName: string = "";
  deliveryAddress: string = "";
  phoneNumber: string = "";
  status: string = "PENDING_EXECUTION";
  orderDate: string;
  managerName: string = "";
  changeStatusDate: string = "";
  dateOfCompleted: string = "";

  constructor(
    itemsFood: CartItemFood[],
    totalPrice: number,
    fullName: string,
    deliveryAddress: string,
    phoneNumber: string,
    orderDate: string
  ) {
    this.itemsFood = itemsFood;
    this.totalPrice = totalPrice;
    this.fullName = fullName;
    this.deliveryAddress = deliveryAddress;
    this.phoneNumber = phoneNumber;
    this.orderDate = orderDate;
  }

}
