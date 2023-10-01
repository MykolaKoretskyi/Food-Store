import {Tags} from "./tags";
import {Origins} from "./origins";
import {ImageUrl} from "./image-url";

export class Food {

  id!: number;
  name!: string;
  description!: string;
  price!: number;
  tags!: Tags[];
  favorite: boolean = false;
  stars: number = 0;
  imageUrl!: ImageUrl;
  origins!: Origins[];
  cookTime!: string;
}
