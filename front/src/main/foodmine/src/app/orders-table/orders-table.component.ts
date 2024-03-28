import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {OrderData} from "../services/orders/order-data";
import {FoodService} from "../services/food/food.service";
import {AuthService} from "../services/auth/auth-service";
import {CartItemFood} from "../services/orders/cartitem-food";
import {OrderDataForTable} from "../services/orders/order-data-for-table";
import {Router} from "@angular/router";
import {CartPageStorage} from "../services/cart-page/cart-page-storage";
import {DatePipe} from "@angular/common";
import {TokenStorage} from "../services/auth/token-storage";
import {ManagerService} from "../services/manager/manager-service";

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.css']
})
export class OrdersTableComponent implements AfterViewInit {

  displayedColumns: string[] =
    ['id', 'username', 'itemsFood', 'totalPrice', 'deliveryAddress', 'phoneNumber',
      'status', 'orderDate', 'managerName', 'timeByManager', 'timeOfCompleted'];
  ordersList: OrderData[] = [];
  orderDataForTable: OrderDataForTable[] = [];
  dataSource!: MatTableDataSource<OrderDataForTable>;
  allStatuses: Array<string> = ['PENDING_EXECUTION', 'WORK_IN_PROGRESS', 'CANCELLED', 'DONE'];

  constructor(
    private liveAnnouncer: LiveAnnouncer,
    private foodService: FoodService,
    private authService: AuthService,
    private cartPageStorage: CartPageStorage,
    private tokenStorage: TokenStorage,
    private managerService: ManagerService,
    private router: Router
  ) {
  }

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  ngAfterViewInit(): void {
    if (!this.tokenStorage.getAuthorities().includes("MANAGER")) {
      this.goToFoodMine();
      return;
    }
    this.getOrders();

    setTimeout((): void => {
      const initialSort: Sort = { active: 'id', direction: 'desc' };
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


  private getOrders(): void {

    this.foodService.getOrders().subscribe(
      {
        next: (response => {

          this.orderDataForTable = this.convertToListOrderDataForTable(response);
          this.dataSource = new MatTableDataSource<OrderDataForTable>(this.orderDataForTable);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.ordersList = response;
        }),
        error: (error => {
          if (error.status == 401) {
            this.authService.refreshToken();
            this.getOrders();
          } else if (error.status == 403) {
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }

  private convertToListOrderDataForTable(orderData: OrderData[]): OrderDataForTable[] {
    let ordersList: OrderDataForTable[] = [];
    orderData.forEach(order => {

      let dateChangeStatus: string = "";
      let dateCompleted: string = "";
      if (order.changeStatusDate != null) {
        dateChangeStatus = new Date(order.changeStatusDate + ".000Z").toString();
      }
      if (order.dateOfCompleted != null) {
        dateCompleted = new Date(order.dateOfCompleted + ".000Z").toString();
      }
      ordersList.push(new OrderDataForTable(
        order.id,
        order.username,
        this.concatItemsFood(order.itemsFood),
        order.totalPrice,
        order.fullName,
        order.deliveryAddress,
        order.phoneNumber,
        order.status,
        new Date(order.orderDate + ".000Z").toString(),
        order.managerName,
        dateChangeStatus,
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

  public goToCartPage(id: number): void {
    this.managerService.setManagerPageIsOpen(false);
    let order: OrderData = this.ordersList.filter(function (e: OrderData): boolean {
      return e.id == id;
    })[0];
    this.cartPageStorage.removeAll();
    order.itemsFood.forEach(order => {
      this.cartPageStorage.saveSelectedFood(order.food.id.toString(), order.quantity.toString());

    });
    this.router.navigate(['/cart-page']);
  }


  changeStatus(orderDataForTable: OrderDataForTable, status: string): void {

    let order: any = this.ordersList.find(order => order.id == orderDataForTable.id);

    let datePipe: DatePipe = new DatePipe("en-US");
    order.orderDate = new Date(datePipe.transform(order.orderDate, 'yyyy-MM-ddTHH:mm') + '').toISOString();
    order.status = this.checkAndChangeStatus(datePipe, order, status);

    if (order.status == status) {
      this.foodService.changeOrderStatus(order).subscribe(
        {
          next: ((): void => {
            this.getOrders();
          }),
          error: (error => {
            if (error.status == 401) {
              this.authService.refreshToken();
              this.changeStatus(orderDataForTable, status);
            } else if (error.status == 403) {
              console.log("Not authorized !");
            } else {
              console.error(error);
            }
          }),
        });
    } else {
      this.getOrders();
    }
  }

  private goToFoodMine(): void {
    this.cartPageStorage.removeAll();
    this.router.navigate(['/']);
  }

  private checkAndChangeStatus(datePipe: DatePipe, order: OrderData, status: string): string {

    let changedStatus: string;
    let availableStatus: Array<string> = ['CANCELLED', 'DONE'];

    if (order.status == 'PENDING_EXECUTION' && status == 'WORK_IN_PROGRESS') {

      changedStatus = status;
      order.managerName = this.tokenStorage.getUsername() + ": " + status;
      order.changeStatusDate = new Date(datePipe.transform(Date.now(), 'yyyy-MM-ddTHH:mm') + '').toISOString();

    } else if ((order.status == 'PENDING_EXECUTION') && availableStatus.includes(status)) {
      order.managerName = this.tokenStorage.getUsername() + ": " + status;
      changedStatus = status;
      order.dateOfCompleted = new Date(datePipe.transform(Date.now(), 'yyyy-MM-ddTHH:mm') + '').toISOString();

    } else if ((order.status == 'WORK_IN_PROGRESS') && availableStatus.includes(status)) {
      changedStatus = status;
      order.dateOfCompleted = new Date(datePipe.transform(Date.now(), 'yyyy-MM-ddTHH:mm') + '').toISOString();

    } else {
      changedStatus = order.status;
    }
    return changedStatus;
  }


}
