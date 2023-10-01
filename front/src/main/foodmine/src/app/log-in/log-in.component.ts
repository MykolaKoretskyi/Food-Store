import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth/auth-service";
import {TokenStorage} from "../services/auth/token-storage";
import {Router} from "@angular/router";
import {LoginData} from "../services/auth/login-data";
import {MatDialogRef} from "@angular/material/dialog";
import {ExceptionService} from "../services/exceptions/exception-service";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {


  isLoggedIn: boolean = false;
  loginForm: FormGroup | any;


  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorage,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<LogInComponent>,
    private exceptionService: ExceptionService
  ) {
  }


  ngOnInit(): void {
    this.loginForm = this.createLoginForm();
  }

  createLoginForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  checkAndLogIn() {

    if (this.checkValidityOfFormData()) {
      return;
    }

    let loginData: LoginData = new LoginData(
      this.loginForm.value.username,
      this.loginForm.value.password
    );
    this.logIn(loginData);
  }

  private checkValidityOfFormData(): boolean {

    let message: string = "";

    if (this.loginForm.get('username').hasError('required')) {
      message += 'Username is required. \n\n';
    }
    if (this.loginForm.get('username').hasError('minlength')
      && this.loginForm.get('username').touched) {
      message += 'Username must be at least 3 characters long. \n\n';
    }
    if (this.loginForm.get('password').hasError('required')) {
      message += 'Password is required. \n\n';
    }
    if (this.loginForm.get('password').hasError('minlength')
      && this.loginForm.get('password').touched) {
      message += 'Password must be at least 6 characters long. \n\n';
    }
    if (message != "") {
      this.exceptionService.noValidValue("25rem", message);
      return true;
    }
    return false;
  }


  private logIn(loginData: LoginData) {

    this.authService.logIn(loginData).subscribe(
      {
        next: (response => {
          this.tokenStorage.saveUsername(loginData.username);
          this.tokenStorage.saveAccessToken(response.accessToken);
          this.tokenStorage.saveRefreshToken(response.refreshToken);
          this.tokenStorage.saveAuthorities(response.rolesNames);
          this.isLoggedIn = true;
          this.dialogRef.close('The popup dialog is closed!');
        }),
        error: (error => {
          console.error(error);
          this.exceptionService.error(error.status, error.error.error);
        }),
      });
  }
}


