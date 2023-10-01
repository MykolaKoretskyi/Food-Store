import {Injectable} from "@angular/core";

const ID_KEY = 'Id';
const PAGE_KEY = 'pageNumber';
const SEARCH_KEY = 'tagPageNumber';
const TAG_INDEX_KEY = 'tagIndex';

@Injectable({
  providedIn: 'root'
})

export class FoodIdStorage {

  constructor() {}

  public saveId(id: number): void {

    window.localStorage.removeItem(ID_KEY);
    window.localStorage.setItem(ID_KEY, id + "");
  }

  public getId(): number {
    return Number(localStorage.getItem(ID_KEY));
  }
  removeId(): void {
    window.localStorage.removeItem(ID_KEY);
  }

  public saveSearch(search: string): void {

    window.localStorage.removeItem(SEARCH_KEY);
    window.localStorage.setItem(SEARCH_KEY, search);
  }

  getSearch(): string | null {
    return localStorage.getItem(SEARCH_KEY);
  }

  public savePageNumber(pageNumber: number): void {

    window.localStorage.removeItem(PAGE_KEY);
    window.localStorage.setItem(PAGE_KEY, pageNumber + "");
  }

  getPageNumber(): number {
    return Number(localStorage.getItem(PAGE_KEY));
  }

  saveTagIndex(id: number): void {
    window.localStorage.removeItem(TAG_INDEX_KEY);
    window.localStorage.setItem(TAG_INDEX_KEY, id + "");
  }

  public getTagIndex(): number {
    return Number(localStorage.getItem(TAG_INDEX_KEY));
  }

  removeSearch(): void {
    window.localStorage.removeItem(SEARCH_KEY);
  }

}
