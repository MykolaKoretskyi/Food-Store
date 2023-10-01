export class OrderDataForTable {

  id: any = null;
  username: any = null;
  itemsFood: string = "";
  totalPrice: number = 0.0;
  fullName: string = "";
  deliveryAddress: string = "";
  phoneNumber: string = "";
  status: string = "";
  orderDate: string = "";
  managerName: string = "";
  changeStatusDate: string = "";
  dateOfCompleted: string = "";

  constructor(
    id: any,
    username: any,
    itemsFood: string,
    totalPrice: number,
    fullName: string,
    deliveryAddress: string,
    phoneNumber: string,
    status: string,
    orderDate: string,
    managerName: string,
    changeStatusDate: string,
    dateOfCompleted: string
  ) {
    this.id = id;
    this.username = username;
    this.itemsFood = itemsFood;
    this.totalPrice = totalPrice;
    this.fullName = fullName;
    this.deliveryAddress = deliveryAddress;
    this.phoneNumber = phoneNumber;
    this.status = status;
    this.orderDate = orderDate;
    this.managerName = managerName;
    this.changeStatusDate = changeStatusDate;
    this.dateOfCompleted = dateOfCompleted;
  }

}
