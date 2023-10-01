import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ManagerService {


  private managerPageIsOpenSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  getManagerPageIsOpenObservable():Observable<boolean> {
    return this.managerPageIsOpenSubject.asObservable();
  }

  setManagerPageIsOpen(isOpen: boolean): void {
    this.managerPageIsOpenSubject.next(isOpen);
  }
}
