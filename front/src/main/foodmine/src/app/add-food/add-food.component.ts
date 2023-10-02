import {Component, OnInit} from '@angular/core';
import {FoodService} from "../services/food/food.service";
import {AuthService} from "../services/auth/auth-service";
import {Router} from "@angular/router";
import {FoodForRequest} from "../services/food/food-for-request";
import {ImageUrl} from "../models/image-url";
import {ExceptionService} from "../services/exceptions/exception-service";
import {ManagerService} from "../services/manager/manager-service";


@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.css']
})

export class AddFoodComponent implements OnInit {

  allOrigins: string[] = [];
  selectedOrigins: string[] = [];
  allTags: string[] = [];
  selectedTags: string[] = [];
  foodName: string = "";
  foodPrice: string = "";
  foodCookTime: string = "";
  foodImageUrl: string = "";
  foodDescription: string = "";
  file: any;
  fileName: string = "";
  maxSizeFileInBytes: number = 1048575;

  constructor(
    private foodService: FoodService,
    private authService: AuthService,
    private exceptionService: ExceptionService,
    private managerService: ManagerService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.managerService.setManagerPageIsOpen(false);
    this.extractAllOrigins();
    this.extractAllTags();
  }

  onKeyFoodName(event: any): void {
    this.foodName = event.target.value;
  }

  changeOriginsValue(event: any, originName: string): void {

    if (event.target.checked) {
      this.selectedOrigins.push(originName);
    } else if (this.selectedOrigins.includes(originName)) {
      this.selectedOrigins = this.selectedOrigins.filter(origin => origin !== originName);
    }
  }

  changeTagsValue(event: any, tagName: string): void {

    if (event.target.checked) {
      this.selectedTags.push(tagName);
    } else if (this.selectedTags.includes(tagName)) {
      this.selectedTags = this.selectedTags.filter(tag => tag !== tagName);
    }
  }


  confirm() {
    if (this.someFieldNoValid()) {
      return;
    }
    this.transferImageAndCreateFood(this.file);
  }

  private createFood(): void {
    this.foodService.addFood(this.createFoodForRequest()).subscribe(
      {
        next: (response => {
          this.goToManagerPage();
        }),
        error: (error => {
          if (error.status == 401) {
            this.authService.refreshToken();
            this.confirm();
          } else if (error.status == 403) {
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }

  private createFoodForRequest(): FoodForRequest {

    return new FoodForRequest(
      -1,
      this.foodName,
      this.foodDescription,
      Number(this.foodPrice),
      this.selectedTags,
      false,
      0,
      new ImageUrl(this.fileName, this.foodImageUrl),
      this.selectedOrigins,
      this.foodCookTime
    );
  }

  private someFieldNoValid(): boolean {

    let message: string = "";

    if (this.foodName.length < 3) {
      message += 'The name of the food must contain at least 3 characters.\n\n';
    }
    if (this.foodPrice.length < 1) {
      message += 'Food price must contain at least one character.\n\n';
    } else if (isNaN(Number(this.foodPrice))) {
      message += 'You did not enter a number in the Food price line.\n\n';
    }
    if (this.foodCookTime.length < 1) {
      message += 'Food cook time must contain at least one character.\n\n';
    }
    if (this.foodDescription.length < 3) {
      message += 'The description of the food must contain at least 3 characters.\n\n';
    }
    if (this.selectedOrigins[0] == undefined) {
      message += 'You must specify origin for this food.\n\n';
    }
    if (this.selectedTags[0] == undefined) {
      message += 'You must specify tag for this food.\n\n';
    }
    if (this.fileName.includes("_")) {
      message += 'The name of the image must not contain the symbol "_".\n\n';
    }
    if (this.file != undefined && this.file.size >= this.maxSizeFileInBytes) {
      message += 'File size must be less than '+ this.maxSizeFileInBytes +' bytes.\n\n';
    }

    if(message != ""){
      this.exceptionService.noValidValue("37rem", message);
      return true;
    }
    return false;
  }

  private extractAllTags(): void {

    this.foodService.getAllTag().subscribe(
      {
        next: (response => {
          response.filter(tagObject => tagObject.name != "ALL")
          .forEach(tagObject => this.allTags.push(tagObject.name));

        }),
        error: (error => {
          if (error.status == 401) {
            //   // this.tokenStorage.setIsRefresh(true);
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

  private extractAllOrigins(): void {

    this.foodService.getAllOrigin().subscribe(
      {
        next: (response => {
          this.allOrigins = response;
        }),
        error: (error => {
          if (error.status == 401) {
            this.authService.refreshToken();
            this.extractAllOrigins();
          } else if (error.status == 403) {
            console.log("Not authorized !");
          } else {
            console.error(error);
          }
        }),
      });
  }


  private goToManagerPage(): void {
    this.router.navigateByUrl('/manager-page');
  }


  onFileSelected(event: any): void {

    this.file = event.target.files[0];
    this.fileName = this.file.name;
  }

  private transferImageAndCreateFood(file: File): void {

    this.foodService.transferFile(file).subscribe(
      {
        next: (response => {
          this.foodImageUrl = response.url;
          this.createFood();
        }),
        error: (error => {
          if (error.status == 401) {
            this.authService.refreshToken();
            this.transferImageAndCreateFood(file);
          } else if (error.status == 403) {
            console.log("Not authorized !");
          } else {
            console.error(error);
            this.createFood();
          }
        }),
      });
  }
}
