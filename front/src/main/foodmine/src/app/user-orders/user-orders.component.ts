import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {OrderDataForUsers} from "../services/orders/order-data-for-users";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {FoodService} from "../services/food/food.service";
import {AuthService} from "../services/auth/auth-service";
import {OrderData} from "../services/orders/order-data";
import {CartItemFood} from "../services/orders/cartitem-food";

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent {

  orderDataForUsers: OrderDataForUsers[] = [];
  dataSource!: MatTableDataSource<OrderDataForUsers>;
  displayedColumns: string[] = ['id', 'itemsFood', 'totalPrice',
    'deliveryAddress', 'phoneNumber', 'status', 'orderDate', 'timeOfCompleted'];

  constructor(
    private liveAnnouncer: LiveAnnouncer,
    private foodService: FoodService,
    private authService: AuthService
  ) {}

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  ngAfterViewInit(): void {
    this.getOrdersForUser();
    setTimeout(() => {
      // Встановлюємо початковий стан сортування для MatSort
      const initialSort: Sort = {active: 'id', direction: 'asc'};
      this.sort.active = initialSort.active;
      this.sort.direction = initialSort.direction;
    });
  }


  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort): void {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }


  private getOrdersForUser(): void {

    this.foodService.getOrdersForUser().subscribe(
      {
        next: (response => {

          this.orderDataForUsers = this.convertToListOrderDataForUsers(response);
          this.dataSource = new MatTableDataSource<OrderDataForUsers>(this.orderDataForUsers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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


  private convertToListOrderDataForUsers(orderData: OrderData[]): OrderDataForUsers[] {
    let ordersList: OrderDataForUsers[] = [];
    orderData.forEach(order => {

      let dateCompleted: string = "";
      if (order.dateOfCompleted != null) {
        dateCompleted = new Date(order.dateOfCompleted + ".000Z").toString();
      }
      ordersList.push(new OrderDataForUsers(
        order.id,
        this.concatItemsFood(order.itemsFood),
        order.totalPrice,
        order.deliveryAddress,
        order.phoneNumber,
        order.status,
        new Date(order.orderDate + ".000Z").toString(),
        dateCompleted
      ));
    })
    return ordersList;
  }

  private concatItemsFood(itemsFood: CartItemFood[]): string {
    let itemsString: string = "";
    itemsFood.forEach(itemFood => {
      itemsString += itemFood.food.name + ": " + itemFood.quantity + "; ";
    });
    return itemsString.slice(0, -2);
  }
}
