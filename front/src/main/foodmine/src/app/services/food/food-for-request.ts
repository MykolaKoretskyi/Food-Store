import {ImageUrl} from "../../models/image-url";

export class FoodForRequest {

  id!: number;
  name!: string;
  description!: string;
  price!: number;
  tagsNames?: string[];
  favorite: boolean = false;
  stars: number = 0;
  imageUrl!: ImageUrl;
  originsNames!: string[];
  cookTime!: string;

  constructor(
    id: number,
    name: string,
    description: string,
    price: number,
    tagsNames: string[],
    favorite: boolean,
    stars: number,
    imageUrl: ImageUrl,
    originsNames: string[],
    cookTime: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.tagsNames = tagsNames;
    this.favorite = favorite;
    this.stars = stars;
    this.imageUrl = imageUrl;
    this.originsNames = originsNames;
    this.cookTime = cookTime;
  }

}
