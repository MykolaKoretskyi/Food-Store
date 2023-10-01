import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {RegisterData} from "./register-data";
import {JwtResponse} from "./jwt-response";
import {LoginData} from "./login-data";
import {TokenStorage} from "./token-storage";


const httpOptions = {
  headers: new HttpHeaders({'Content-type': 'application/json'})
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl: string = '/api/v1/auth/authenticate';
  private registerUrl: string = '/api/v1/auth/register';
  private refreshUrl: string = '/api/v1/auth/refresh-token';
  private logoutUrl: string = '/api/v1/auth/logout';
  private readonly baseUrl: string = '';

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage
  ) {
    let isLocalhost: boolean = window.location.hostname.includes('localhost');
    this.baseUrl = isLocalhost ? 'http://localhost:5000' : '';
  }

  logIn(logInData: LoginData): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.baseUrl + this.loginUrl, logInData, httpOptions);
  }

  register(registerData: RegisterData): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.baseUrl + this.registerUrl, registerData, httpOptions);
  }

  refresh(): Observable<JwtResponse> {
    this.tokenStorage.setIsRefresh(true);
    return this.http.post<JwtResponse>(this.baseUrl + this.refreshUrl, httpOptions);
  }


  public refreshToken(): void {

    this.refresh().subscribe(
      {
        next: (response => {
          this.tokenStorage.saveAccessToken(response.accessToken);
          this.tokenStorage.saveRefreshToken(response.refreshToken);
          this.tokenStorage.setIsRefresh(false);
        }),
        error: (error => {
          console.error(error);
          console.log("refresh error, logout");
          this.logout();

        }),
      });
  }


  logout(): void {

    this.postLogout().subscribe(
      {
        next: (response => {
          console.log(response);
        }),
        error: (error => {
          console.error(error);
        }),
      });
    window.localStorage.clear();
    window.location.reload();
  }

  postLogout(): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.baseUrl + this.logoutUrl, httpOptions);
  }

}
