import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RegisterData} from "../services/auth/register-data";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TokenStorage} from "../services/auth/token-storage";
import {AuthService} from "../services/auth/auth-service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ExceptionService} from "../services/exceptions/exception-service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  registerForm: any = {};
  isLoggedIn: boolean = false;
  errorMessage: string = '';

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private tokenStorage: TokenStorage,
    private router: Router,
    private formBuilder: FormBuilder,
    private exceptionService: ExceptionService,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) {}

  ngOnInit(): void {
    this.checkBoxListener();

    if (this.tokenStorage.getAccessToken()) {
      this.isLoggedIn = true;
    }
    this.registerForm = this.createRegisterForm();
  }


  private checkBoxListener(): void {
    let checkbox: any = document.querySelector("input[name=subscribe]");
    let btn: any = document.querySelector("button[name=submit]");
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        btn.disabled = false;
      } else {
        btn.disabled = true;
      }
    });
  }

  createRegisterForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  checkAndRegister(): void {

    if (this.checkValidityOfFormData()) {
      return;
    }
    let registerData: RegisterData = new RegisterData(
      this.registerForm.value.username,
      this.registerForm.value.email,
      this.registerForm.value.password);

    this.register(registerData);
  }



  private checkValidityOfFormData(): boolean {

    let message: string = "";

    if (this.registerForm.get('username').hasError('required')) {
      message += 'Username is required. \n\n';
    }
    if (this.registerForm.get('username').hasError('minlength')
      && this.registerForm.get('username').touched) {
      message += 'Username must be at least 3 characters long. \n\n';
    }
    if (this.registerForm.get('email').hasError('required')) {
      message += 'Email is required. \n\n';
    }
    if (this.registerForm.get('email').hasError('email')
      && this.registerForm.get('email').touched) {
      message += 'You have entered an invalid Email. \n\n';
    }
    if (this.registerForm.get('password').hasError('required')) {
      message += 'Password is required. \n\n';
    }
    if (this.registerForm.get('password').hasError('minlength')
      && this.registerForm.get('password').touched) {
      message += 'Password must be at least 6 characters long. \n\n';
    }
    if(message != ""){
      this.exceptionService.noValidValue("25rem", message);
      return true;
    }
    return false;
  }


  register(registerData: RegisterData): void {

    this.authService.register(registerData).subscribe(
      {
        next: (response => {
          this.tokenStorage.saveUsername(registerData.username);
          this.tokenStorage.saveAccessToken(response.accessToken);
          this.tokenStorage.saveRefreshToken(response.refreshToken);
          this.tokenStorage.saveAuthorities(response.rolesNames);
          this.isLoggedIn = true;
          this.dialogRef.close('The popup dialog is closed!');
          // this.reloadHomePage();
          window.location.reload();
        }),
        error: (error => {
          this.exceptionService.error(error.status, error.error.error);
          console.error(error);
        }),
      });
  }
}
