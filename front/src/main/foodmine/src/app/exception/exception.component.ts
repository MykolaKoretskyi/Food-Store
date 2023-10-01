import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TokenStorage} from "../services/auth/token-storage";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth/auth-service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.css']
})
export class ExceptionComponent implements OnInit{

  @Input() headerMessage: string = '';
  @Input() errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorage,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ExceptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.headerMessage = this.data.headerMessage;
    this.errorMessage = this.data.errorMessage;
  }

  close(): void {
    this.dialogRef.close('The popup dialog is closed!');
  }
}
