import {Injectable} from "@angular/core";

const FOOD_ID = 'id';
const FOOD_COUNT = 'count';


@Injectable({
  providedIn: 'root'
})

export class CartPageStorage {

  private selectedFoodsId: Array<string> = [];
  private selectedFoodsCount: Array<string> = [];

  constructor() {
  }

  public saveSelectedFood(selectedFoodId: string, selectedFoodCount: string): void {

    this.getSelectedFoodsId();
    this.selectedFoodsId.push(selectedFoodId);
    window.localStorage.removeItem(FOOD_ID);
    window.localStorage.setItem(FOOD_ID, JSON.stringify(this.selectedFoodsId));

    this.getSelectedFoodsCont();
    this.selectedFoodsCount.push(selectedFoodCount);
    window.localStorage.removeItem(FOOD_COUNT);
    window.localStorage.setItem(FOOD_COUNT, JSON.stringify(this.selectedFoodsCount));
  }


  public getSelectedFoodsCont(): string[] {
    let foodsCountString: string = localStorage.getItem(FOOD_COUNT) + "";
    if (localStorage.getItem(FOOD_COUNT) != null) {
      this.selectedFoodsCount = [];
      JSON.parse(foodsCountString).forEach((foodCountString: string): void => {
        this.selectedFoodsCount.push(foodCountString);
      });
    }
    return this.selectedFoodsCount;
  }

  public getSelectedFoodsId(): string [] {
    let foodsIdString: string = localStorage.getItem(FOOD_ID) + "";
    if (localStorage.getItem(FOOD_ID) != null) {
      this.selectedFoodsId = [];
      JSON.parse(foodsIdString).forEach((foodIdString: string): void => {
        this.selectedFoodsId.push(foodIdString);
      });
    }
    return this.selectedFoodsId;
  }

  changeQuantitySelectedFood(id: string, count: string): void {

    if (localStorage.getItem(FOOD_ID) != null) {
      this.selectedFoodsId = [];
      JSON.parse(localStorage.getItem(FOOD_ID) + "").forEach((foodIdString: string): void => {
        this.selectedFoodsId.push(foodIdString);
      });
      let index: number = this.selectedFoodsId.indexOf(id);

      if (index > -1) {

        this.selectedFoodsCount = [];
        let i: number = 0;
        JSON.parse(localStorage.getItem(FOOD_COUNT) + "")
        .forEach((foodCountString: string): void => {
          if (index == i) {
            foodCountString = count;
          }
          this.selectedFoodsCount.push(foodCountString);
          i++;
        });
        window.localStorage.removeItem(FOOD_COUNT);
        window.localStorage.setItem(FOOD_COUNT, JSON.stringify(this.selectedFoodsCount));
        return;
      }
      this.saveSelectedFood(id, count);
      return;
    }
    this.saveSelectedFood(id, count);

  }

  getQuantityById(id: string): number {

    if (localStorage.getItem(FOOD_ID) != null) {
      this.selectedFoodsId = [];
      JSON.parse(localStorage.getItem(FOOD_ID) + "").forEach((foodIdString: string): void => {
        this.selectedFoodsId.push(foodIdString);
      });
      let index: number = this.selectedFoodsId.indexOf(id);
      let count: string = "";
      this.selectedFoodsCount = [];
      let i: number = 0;
      JSON.parse(localStorage.getItem(FOOD_COUNT) + "")
      .forEach((foodCountString: string): void => {
        if (index == i) {
          count = foodCountString;
        }
        i++;
      });
      return Number(count);
    }
    return 0;
  }

  removeFoodFromCart(id: string): void {

    if (localStorage.getItem(FOOD_ID) != null) {
      this.selectedFoodsId = [];
      JSON.parse(localStorage.getItem(FOOD_ID) + "").forEach((foodIdString: string): void => {
        this.selectedFoodsId.push(foodIdString);
      });
      let index: number = this.selectedFoodsId.indexOf(id);
      let foodsId: Array<string> = this.selectedFoodsId;
      this.selectedFoodsCount = [];
      this.selectedFoodsId = [];
      let i: number = 0;
      JSON.parse(localStorage.getItem(FOOD_COUNT) + "")
      .forEach((foodCountString: string): void => {
        if (index != i) {
          this.selectedFoodsCount.push(foodCountString);
          this.selectedFoodsId.push(foodsId[i]);
        }
        i++;
      });
      window.localStorage.removeItem(FOOD_COUNT);
      window.localStorage.setItem(FOOD_COUNT, JSON.stringify(this.selectedFoodsCount));
      window.localStorage.removeItem(FOOD_ID);
      window.localStorage.setItem(FOOD_ID, JSON.stringify(this.selectedFoodsId));
    }
  }

  removeAll(): void {
    window.localStorage.removeItem(FOOD_COUNT);
    window.localStorage.removeItem(FOOD_ID);
    this.selectedFoodsId = [];
    this.selectedFoodsCount = [];
  }
}
