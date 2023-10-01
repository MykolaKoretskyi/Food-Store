import {Component, OnInit} from '@angular/core';
import {FoodService} from "../services/food/food.service";
import {Food} from "../models/food";
import {ActivatedRoute, Router} from "@angular/router";
import {FoodIdStorage} from "../services/food/food-id-storage";
import {Tag} from "../models/tag";
import {AuthService} from "../services/auth/auth-service";
import {CartPageService} from "../services/cart-page/cart-page.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tags!: Tag[];
  foods: Food[] = [];
  pages: Array<number> = [];
  pageNumber: number = 0;
  sizePage: string = "8";
  private pageable: { page: number, size: string, sort: string } =
    {page: this.pageNumber, size: this.sizePage, sort: "id"};
  search: string | undefined;

  constructor(
    private foodService: FoodService,
    private route: ActivatedRoute,
    private router: Router,
    private idStorage: FoodIdStorage,
    private authService: AuthService,
    private cartPageService: CartPageService
  ) {
  }

  ngOnInit(): void {
    this.pageNumber = this.idStorage.getPageNumber();
    this.extractAllTagsAndGetFoods();
  }

  private getFoods(): void {

    let srchTerm: string = "";
    let srchTag: string = "";

    let tagIndex: number = this.idStorage.getTagIndex()
    if (tagIndex) {
      srchTag = this.tags[tagIndex].name;

      if (srchTag == this.tags[tagIndex].name) {
        this.pageNumber = this.idStorage.getPageNumber();
      } else {
        this.idStorage.savePageNumber(0);
        this.idStorage.saveTagIndex(this.tags.indexOf(
          this.tags.filter(t => t.name == srchTag)[0]
        ));
        this.pageNumber = 0;
      }
    } else if (this.idStorage.getSearch() != null) {
      srchTerm = this.idStorage.getSearch() + "";
      this.pageNumber = this.idStorage.getPageNumber()
    }
    this.pageable = {page: this.pageNumber, size: this.sizePage, sort: "id"};
    if (srchTag == "ALL") {
      srchTag = "";
    }
    this.foodService.getAllAvailableFoods(0, srchTerm, srchTag, this.pageable)
    .subscribe({next: (response => {

        this.foods = response.content;
        this.pages = new Array(response['totalPages']);
      }),
      error: (error => {
        if (error.status == 401) {
          this.getFoods();
        } else if (error.status == 403) {
          console.log("Not authorized !");
        } else {
          console.error(error);
        }
      }),
    });
  }

  setPage(i: number, event: any): void {
    event.preventDefault();
    this.pageNumber = i;
    this.idStorage.savePageNumber(i);
    this.getFoods();
  }

  goToFoodPage(id: number): void {
    this.router.navigateByUrl('food').then(r => {
      this.idStorage.saveId(id)
    });
  }

  private extractAllTagsAndGetFoods(): void {

    this.foodService.getAllTag().subscribe(
      {
        next: (response => {
          this.tags = response;
          this.getFoods();
        }),
        error: (error => {
          if (error.status == 401) {
            this.authService.refreshToken();
            this.extractAllTagsAndGetFoods();
          } else if (error.status == 403) {
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }


  goToFoodMine(): void {
    this.idStorage.removeSearch();
    this.cartPageService.setCartPageIsOpen(false);
    this.router.navigateByUrl("/reload").then(() =>
      this.router.navigateByUrl(""));
  }
}
