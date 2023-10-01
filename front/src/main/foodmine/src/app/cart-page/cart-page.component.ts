import {Component, OnInit} from '@angular/core';
import {CartService} from "../services/cart/cart.service";
import {Cart} from "../models/cart";
import {CartItem} from "../models/cartitem";
import {TokenStorage} from "../services/auth/token-storage";
import {CartPageService} from "../services/cart-page/cart-page.service";
import {CartPageStorage} from "../services/cart-page/cart-page-storage";
import {Router} from "@angular/router";
import {FoodIdStorage} from "../services/food/food-id-storage";
import {OrderPageComponent} from "../order-page/order-page.component";
import {MatDialog} from "@angular/material/dialog";
import {ExceptionService} from "../services/exceptions/exception-service";

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  cart!: Cart;
  isLoggedIn: boolean = false;
  defaultQuantity: Array<number> = [];
  isManager!: boolean;


  constructor(
    private dialog: MatDialog,
    private cartService: CartService,
    private tokenStorage: TokenStorage,
    private cartPageService: CartPageService,
    private cartPageStorage: CartPageStorage,
    private router: Router,
    private idStorage: FoodIdStorage,
    private exceptionService: ExceptionService
  ) {
  }

  ngOnInit(): void {

    this.isManager = this.tokenStorage.getAuthorities().includes("MANAGER");
    this.cartPageService.setCartPageIsOpen(true);
    this.cart = this.cartService.getCart();
    this.cart.setItems();
    this.isLoggedIn = this.tokenStorage.getAccessToken() != null;
  }

  removeFromCart(cartItem: CartItem): void {
    this.cartService.removeFromCart(cartItem.food.id);
    this.cart = this.cartService.getCart();
  }


  changeQuantity(cartItem: CartItem, quantityInString: string): void {

    const quantity: number = Number(quantityInString);

    if (!isNaN(quantity) && quantity > 0 && !quantityInString.includes(".")) {
      this.cartService.changeQuantity(cartItem.food.id, quantity);
      this.cart = this.cartService.getCart();

    } else if (isNaN(quantity) || quantity == 0 || quantityInString.includes(".")) {
      this.exceptionService.noValidValue(
        "20rem",
        "The number cannot be: " + quantityInString
      );
      this.reloadPage();
    }
  }

  goToFoodPage(id: number): void {
    this.router.navigateByUrl('food').then(r => {
      this.idStorage.saveId(id)
    });
  }

  orderSelected(): void {
    this.dialog.open(OrderPageComponent,
      {
        data: ['Login in system'],
        hasBackdrop: true,
        width: "42vw",
        minWidth: "300px",
        // height: "75vh",
        disableClose: false,
        autoFocus: true
      });
  }

  increment(cartItem: CartItem): void {
    this.cartService.changeQuantity(cartItem.food.id, cartItem.quantity + 1);
    this.cart = this.cartService.getCart();
  }

  decrement(cartItem: CartItem): void {
    if (cartItem.quantity > 1) {
      this.cartService.changeQuantity(cartItem.food.id, cartItem.quantity - 1);
      this.cart = this.cartService.getCart();

    } else {
      this.exceptionService.noValidValue(
        "20rem",
        "The number cannot be: " + (cartItem.quantity - 1)
      );
      this.reloadPage();
    }
  }

  private reloadPage() {
    this.router.navigateByUrl("/reload").then(() =>
      this.router.navigateByUrl("/cart-page"));
  }
}
