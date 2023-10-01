import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {Cart} from "../models/cart";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CartService} from "../services/cart/cart.service";
import {TokenStorage} from "../services/auth/token-storage";
import {CartPageService} from "../services/cart-page/cart-page.service";
import {CartPageStorage} from "../services/cart-page/cart-page-storage";
import {Router} from "@angular/router";
import {FoodIdStorage} from "../services/food/food-id-storage";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrderData} from "../services/orders/order-data";
import {CartItemFood} from "../services/orders/cartitem-food";
import {FoodService} from "../services/food/food.service";
import {AuthService} from "../services/auth/auth-service";
import {DatePipe} from "@angular/common";
import {ExceptionService} from "../services/exceptions/exception-service";


@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})

export class OrderPageComponent implements OnInit {

  cart: Cart = this.cartService.cart;
  orderForm: FormGroup | any;

  constructor(
    private foodService: FoodService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cartService: CartService,
    private tokenStorage: TokenStorage,
    private cartPageService: CartPageService,
    private cartPageStorage: CartPageStorage,
    private formBuilder: FormBuilder,
    private router: Router,
    private idStorage: FoodIdStorage,
    private dialogRef: MatDialogRef<OrderPageComponent>,
    private renderer: Renderer2,
    private exceptionService: ExceptionService,
    private el: ElementRef
  ) {
  }


  ngOnInit(): void {
    this.orderForm = this.createOrderForm();
  }

  ngAfterViewInit(): void {
    const dialogContent = this.el.nativeElement.querySelector('.mat-mdc-dialog-content');
    const dialogContainer = this.el.nativeElement.querySelector('.mat-mdc-dialog-container');

    // Отримати висоту контенту в діалоговому вікні
    const contentHeight = dialogContent.scrollHeight;

    // Встановити фоновий стиль для контенту
    this.renderer.setStyle(dialogContent, 'background-image', 'url("/assets/images/bacground/bacground3.jpg")');
    this.renderer.setStyle(dialogContent, 'background-repeat', 'repeat');
    this.renderer.setStyle(dialogContent, 'background-size', '100% 100%');

    // Встановити висоту контейнера діалогового вікна, щоб він вміщував контент
    this.renderer.setStyle(dialogContainer, 'height', `${contentHeight}px`);
  }

  createOrderForm(): FormGroup {
    return this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      deliveryAddress: ['', [Validators.required, Validators.minLength(4)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9)]],
    });
  }


  goToFoodPage(id: number): void {
    this.router.navigateByUrl('food').then(r => {
      this.idStorage.saveId(id)
    });
  }

  confirm(cart: Cart): void {

    if (this.checkValidityOfFormData()) {
      return;
    }
    let cartItemsFood: CartItemFood[] = [];

    cart.getItems().forEach(item => {
      cartItemsFood.push(new CartItemFood(
        this.foodService.transformToFoodForRequest(item.food), item.quantity)
      );
    })
    let datePipe: DatePipe = new DatePipe("en-US");

    let orderDate: string = new Date(
      datePipe.transform(Date.now(), 'yyyy-MM-ddTHH:mm') + '').toISOString();

    let orderData: OrderData = new OrderData(
      cartItemsFood,
      cart.totalPrice,
      this.orderForm.value.fullName,
      this.orderForm.value.deliveryAddress,
      this.orderForm.value.phoneNumber,
      orderDate
    );
    this.addOrder(orderData);
  }

  private addOrder(orderData: OrderData): void {
    this.foodService.addOrder(orderData).subscribe(
      {
        next: (response => {

          this.dialogRef.afterClosed().subscribe(result => {
            this.cartPageStorage.removeAll();
            this.reloadCartPage();
          });
          this.dialogRef.close('The popup dialog is closed!');
        }),
        error: (error => {
          if (error.status == 401) {
            this.authService.refreshToken();
            this.addOrder(orderData);
          } else if (error.status == 403) {
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }

  private checkValidityOfFormData(): boolean {

    let message: string = "";

    if (this.orderForm.get('fullName').hasError('required')) {
      message += 'Username is required. \n\n';
    }
    if (this.orderForm.get('fullName').hasError('minlength')
      && this.orderForm.get('fullName').touched) {
      message += 'Full Name must be at least 3 characters long. \n\n';
    }
    if (this.orderForm.get('deliveryAddress').hasError('required')) {
      message += 'Password is required. \n\n';
    }
    if (this.orderForm.get('deliveryAddress').hasError('minlength')
      && this.orderForm.get('deliveryAddress').touched) {
      message += 'Delivery Address must be at least 4 characters long. \n\n';
    }
    if (this.orderForm.get('phoneNumber').hasError('required')) {
      message += 'Phone Number is required. \n\n';
    }
    if (this.orderForm.get('phoneNumber').hasError('minlength')
      && this.orderForm.get('phoneNumber').touched) {
      message += 'Phone Number must be at least 9 characters long. \n\n';
    }
    if (message != "") {
      this.exceptionService.noValidValue("25rem", message);
      return true;
    }
    return false;
  }

  private reloadCartPage(): void {

    this.router.navigateByUrl('/reload')
    .then(r => {
      this.router.navigateByUrl('/cart-page')
    });
  }


}
