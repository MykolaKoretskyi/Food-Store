import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FoodIdStorage} from "../services/food/food-id-storage";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchTerm: string = "";

  constructor(
    private route: ActivatedRoute,
    private idStorage: FoodIdStorage,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.idStorage.getSearch() != null) {
      this.searchTerm = this.idStorage.getSearch() + "";
    }
  }

  search(): void {

    if (this.searchTerm) {
      this.idStorage.saveTagIndex(0);
      this.idStorage.saveSearch(this.searchTerm);
      this.idStorage.savePageNumber(0);
      this.reloadToSearch();
    }
  }

  private reloadToSearch(): void {
    this.router.navigateByUrl('/reload')
    .then(r => this.router.navigateByUrl(''));
  }

}
