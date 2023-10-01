export class ImageUrl {

  id!: number;
  imageName!: string;
  url!: string;

  constructor( imageName: string, url: string) {
    this.imageName = imageName;
    this.url = url;
  }

}
