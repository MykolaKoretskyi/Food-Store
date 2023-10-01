import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CartPageService {

  private cartPageIsOpened: any;
  constructor() { }
  getCartPageIsOpen(): boolean {
    return this.cartPageIsOpened;
  }

  setCartPageIsOpen(value: boolean): void {
    this.cartPageIsOpened = value;
  }

}
