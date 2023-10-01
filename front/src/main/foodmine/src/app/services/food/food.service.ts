import {Injectable} from '@angular/core';
import {Food} from "../../models/food";
import {Tag} from "../../models/tag";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FoodForRequest} from "./food-for-request";
import {OrderData} from "../orders/order-data";
import {IdNameFood} from "./id-name";
import {ImageUrl} from "../../models/image-url";

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private foodUrl: string = '/api/v1/food';
  private getAllTagUrl: string = '/api/v1/food/tags';
  private getFoodsByIdsUrl: string = '/api/v1/food/listId';
  private availableFoodUrl: string = '/api/v1/food/available';
  private getStatusFavoriteUrl: string = '/api/v1/food/favorite';
  private postOrderUrl: string = '/api/v1/order';
  private getOrdersUrl: string = '/api/v1/orders';
  private putOrderStatusUrl: string = '/api/v1/order/status';
  private getOrdersForUserUrl: string = '/api/v1/orders-for-user';
  private getFoodIdUrl: string = '/api/v1/food/name';
  private getAllOriginUrl: string = '/api/v1/food/origins';
  private fileImageUrl: string = '/api/v1/food/image-upload';
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    let isLocalhost: boolean = window.location.hostname.includes('localhost');
    this.baseUrl = isLocalhost ? 'http://localhost:5000' : '';
  }

  getFoodById(id: number): Observable<Food> {
    return this.http.get<Food>(this.baseUrl + this.foodUrl + "/" + id);
  }

  getAllTag(): Observable<Tag[]> {
    return this.http.get<Tag[]>(this.baseUrl + this.getAllTagUrl);
  }

  getAllOrigin(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + this.getAllOriginUrl);
  }

  getAllFoods(ignoreId: number, srchTerm: string, srchTag: string, page: any): Observable<any> {
    const params = page;
    return this.http.get<any>(this.baseUrl + this.foodUrl + "?searchTerm=" + srchTerm +
      "&tagName=" + srchTag + "&ignoreId=" + ignoreId, {params});
  }

  getAllAvailableFoods(ignoreId: number, srchTerm: string, srchTag: string, page: any):
    Observable<any> {
    const params = page;
    return this.http.get<any>(this.baseUrl + this.availableFoodUrl + "?searchTerm=" + srchTerm
      + "&tagName=" + srchTag + "&ignoreId=" + ignoreId, {params});
  }

  getFoodsByListId(foodsListId: Array<string>): Observable<Food[]> {
    return this.http.get<Food[]>(this.baseUrl + this.getFoodsByIdsUrl
      + "?listId=" + foodsListId);
  }

  changeFood(foodForRequest: FoodForRequest): Observable<Food> {
    return this.http.put<Food>(this.baseUrl + this.foodUrl + "/"
      + foodForRequest.id, foodForRequest);
  }

  addFood(foodForRequest: FoodForRequest): Observable<Food> {
    return this.http.post<Food>(this.baseUrl + this.foodUrl, foodForRequest);
  }

  public transformToFoodForRequest(food: Food): FoodForRequest {
    let tags: string[] = [];
    if (food.tags) {
      food.tags.forEach(tag => tags.push(tag.name));
    }
    let origins: string[] = [];
    if (food.origins) {
      food.origins.forEach(origin => origins.push(origin.name));
    }
    return new FoodForRequest(
      food.id,
      food.name,
      food.description,
      food.price,
      tags,
      food.favorite,
      food.stars,
      food.imageUrl,
      origins,
      food.cookTime
    );
  }

  changeAndGetStatusFavorite(food: Food): Observable<Food> {
    let foodForRequest: FoodForRequest = this.transformToFoodForRequest(food);
    return this.http.put<Food>(this.baseUrl + this.getStatusFavoriteUrl, foodForRequest);
  }

  getOrders(): Observable<OrderData[]> {
    return this.http.get<OrderData[]>(this.baseUrl + this.getOrdersUrl);
  }

  addOrder(orderData: OrderData): Observable<OrderData> {
    return this.http.post<OrderData>(this.baseUrl + this.postOrderUrl, orderData);
  }

  changeOrderStatus(orderData: OrderData): Observable<OrderData> {
    return this.http.put<OrderData>(this.baseUrl + this.putOrderStatusUrl
      + "/" + orderData.id, orderData);
  }

  getOrdersForUser(): Observable<OrderData[]> {
    return this.http.get<OrderData[]>(this.baseUrl + this.getOrdersForUserUrl);
  }

  getFoodByName(idNameFood: IdNameFood): Observable<Food> {
    return this.http.put<Food>(this.baseUrl + this.getFoodIdUrl, idNameFood);
  }


  deleteFoodById(id: number): Observable<IdNameFood> {
    return this.http.delete<IdNameFood>(this.baseUrl + this.foodUrl + "/" + id);
  }


  transferFile(file: File): Observable<ImageUrl> {
    const formData: FormData = new FormData();
    formData.append("file", file);
    return this.http.post<ImageUrl>(this.baseUrl + this.fileImageUrl, formData);
  }


  transferAndChangeFile(file: File, foodId: number): Observable<ImageUrl> {
    const formData: FormData = new FormData();
    formData.append("file", file);
    formData.append("foodId", foodId.toString());
    return this.http.put<ImageUrl>(this.baseUrl + this.fileImageUrl, formData);
  }

}
