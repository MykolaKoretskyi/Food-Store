export class OrderDataForUsers {

  id: any = null;
  itemsFood: string = "";
  totalPrice: number = 0.0;
  deliveryAddress: string = "";
  phoneNumber: string = "";
  status: string = "";
  orderDate: string = "";
  dateOfCompleted: string = "";

  constructor(
    id: any,
    itemsFood: string,
    totalPrice: number,
    deliveryAddress: string,
    phoneNumber: string,
    status: string,
    orderDate: string,
    dateOfCompleted: string
  ) {
    this.id = id;
    this.itemsFood = itemsFood;
    this.totalPrice = totalPrice;
    this.deliveryAddress = deliveryAddress;
    this.phoneNumber = phoneNumber;
    this.status = status;
    this.orderDate = orderDate;
    this.dateOfCompleted = dateOfCompleted;
  }


}
