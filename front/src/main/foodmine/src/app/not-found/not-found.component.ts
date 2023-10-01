import {Component, Input, OnInit} from '@angular/core';
import {CartPageService} from "../services/cart-page/cart-page.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent{

  @Input() visible: boolean = false;
  @Input() notFoundMessage: string = "Nothing Found!";
  @Input() resetLinkText: string = "Reset";
  @Input() resetLinkRoute: string = "/";

  constructor(
    private cartPageService: CartPageService,
    private router: Router
  ) {}

  goToFoodMine(): void {
     this.cartPageService.setCartPageIsOpen(false);
    this.router.navigateByUrl(this.resetLinkRoute);
  }

}
