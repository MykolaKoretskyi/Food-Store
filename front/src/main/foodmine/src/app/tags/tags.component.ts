import {Component, Input, OnInit} from '@angular/core';
import {Tag} from "../models/tag";
import {FoodService} from "../services/food/food.service";
import {Tags} from "../models/tags";
import {TokenStorage} from "../services/auth/token-storage";
import {AuthService} from "../services/auth/auth-service";
import {FoodIdStorage} from "../services/food/food-id-storage";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  @Input()
  foodPageTags?: Tags[];

  @Input()
  justifyContent: string = 'center';


  tags!: Tag[];
  tagIndex: number = 0;

  constructor(
    private foodService: FoodService,
    private tokenStorage: TokenStorage,
    private authService: AuthService,
    private idStorage: FoodIdStorage,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tagIndex = this.idStorage.getTagIndex();
    this.extractAllTags();
  }


  private extractAllTags(): void {

    this.foodService.getAllTag().subscribe(
      {
        next: (response => {
          this.tags = response;
        }),
        error: (error => {
          if (error.status == 401) {
            this.authService.refreshToken();
            this.extractAllTags();
          } else if (error.status == 403) {
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }

  setTag(i: number, event: any): void {

    event.preventDefault();
    this.tagIndex = i;
    this.idStorage.saveTagIndex(i);
    this.idStorage.savePageNumber(0);
    this.idStorage.removeSearch();
    this.navigateToHome();
  }


  private navigateToHome(): void {
    this.router.navigateByUrl('/reload')
    .then(r => {
      this.router.navigateByUrl('')
    });
  }

}
