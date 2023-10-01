import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../services/auth/auth-service";
import {TokenStorage} from "../services/auth/token-storage";
import {Router} from "@angular/router";
import {LogInComponent} from "../log-in/log-in.component";
import {RegisterComponent} from "../register/register.component";
import {CartPageService} from "../services/cart-page/cart-page.service";
import {FoodIdStorage} from "../services/food/food-id-storage";
import {InfoComponent} from "../info/info.component";
import {ManagerService} from "../services/manager/manager-service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  form: any = {};
  isLoggedIn: boolean = false;
  errorMessage: string = '';
  isManager: boolean = false;
  selectedLanguage: string = "en";
  languages: string[] = ["en", "uk"];
  managerPageIsOpen: boolean = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private tokenStorage: TokenStorage,
    private cartPageService: CartPageService,
    private idStorage: FoodIdStorage,
    private managerService: ManagerService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.tokenStorage.getAccessToken() != null;
    this.isManager = this.tokenStorage.getAuthorities().includes("MANAGER");

    this.managerService.getManagerPageIsOpenObservable()
    .subscribe((isOpen: boolean) => {
      this.managerPageIsOpen = isOpen;

    });
  }


  logInDialog(): void {

    let dialogRef =
      this.dialog.open(LogInComponent,
        {
          data: ['Login in system'],
          hasBackdrop: true,
          width: "24rem",
          height: "21rem",
          disableClose: false,
          autoFocus: true
        }
      );
    dialogRef.afterClosed().subscribe(result => {
      if (this.tokenStorage.getAccessToken() != null) {
        this.isLoggedIn = true;
        window.location.reload();
      }
    });
  }


  registerDialog(): void {

    window.localStorage.clear();
    let dialogRef =
      this.dialog.open(RegisterComponent,
        {
          data: ['Register in system'],
          hasBackdrop: true,
          width: "24rem",
          height: "30rem",
          disableClose: false,
          autoFocus: true
        }
      );
    dialogRef.afterClosed().subscribe(result => {
      if (this.tokenStorage.getAccessToken() != null) {
        this.isLoggedIn = true;
        window.location.reload();
      }
    });
  }

  logout(): void {
    this.router.navigateByUrl('').then(() =>
      this.authService.logout());
  }


  goToCartPage(): void {
    this.cartPageService.setCartPageIsOpen(true);
    this.router.navigateByUrl('/cart-page');
  }

  whetherCartPageIsOpen(): boolean {
    return this.cartPageService.getCartPageIsOpen();
  }

  goToFoodMine(): void {
    this.idStorage.removeSearch();
    this.cartPageService.setCartPageIsOpen(false);
    this.managerService.setManagerPageIsOpen(false);
    this.router.navigateByUrl('');
  }

  goToManagerPage(): void {
    if (this.isManager) {
      this.cartPageService.setCartPageIsOpen(false);
      this.router.navigateByUrl('/manager-page');
    } else {
      this.router.navigateByUrl('');
    }
  }

  infoDialog(): void {

    this.dialog.open(InfoComponent,
      {
        data: ['Information about the program'],
        hasBackdrop: true,
        width: "40rem",
        height: "46rem",
        disableClose: false,
        autoFocus: true
      }
    );
  }
}
