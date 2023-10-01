import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {ExceptionComponent} from "../../exception/exception.component";

@Injectable({
  providedIn: 'root'
})
export class ExceptionService {

  constructor(private dialog: MatDialog) {}

  noValidValue(dialogHeight: string, errorMessage: string): void {

    const headerMessage = 'WARNING!';

    this.dialog.open(ExceptionComponent, {
        data: {headerMessage, errorMessage},
        hasBackdrop: true,
        width: "24rem",
        height: dialogHeight,
        disableClose: false,
        autoFocus: true
      }
    );
  }

  error(status: string, message: string): void {

    const headerMessage = 'WARNING!';
    const errorMessage = 'Status: ' + status + '.\n\n Message: ' + message;

    this.dialog.open(ExceptionComponent, {
        data: {headerMessage, errorMessage},
        hasBackdrop: true,
        width: "24rem",
        height: "21rem",
        disableClose: false,
        autoFocus: true
      }
    );
  }
}
