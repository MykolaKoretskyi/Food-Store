
import {Injectable} from "@angular/core";

const TOKEN_KEY = 'AuthToken';
const TOKEN_REFRESH_KEY = 'RefreshToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})

export class TokenStorage {

  private roles: Array<string> = [];
  private isRefresh: boolean = false;


  public saveAccessToken(token: string): void {

    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, "Bearer " + token);
  }

  public saveRefreshToken(token: string): void {

    window.localStorage.removeItem(TOKEN_REFRESH_KEY);
    window.localStorage.setItem(TOKEN_REFRESH_KEY, "Bearer " + token);
  }

  public getAccessToken(): string | null {
    if(this.isRefresh){
      return this.getRefreshToken()
    }
    return localStorage.getItem(TOKEN_KEY);
  }

  public setIsRefresh(isRefresh:boolean): void{
    this.isRefresh = isRefresh;
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_REFRESH_KEY);
  }

  public saveUsername(username: string): void {
    window.localStorage.removeItem(USERNAME_KEY);
    window.localStorage.setItem(USERNAME_KEY, username);
  }

  public getUsername(): string {
    return localStorage.getItem(USERNAME_KEY)+"";
  }

  public saveAuthorities(authorities: string[]): void {

    authorities.forEach(authority=> {
      this.roles.push(authority);
    });
    window.localStorage.removeItem(AUTHORITIES_KEY);
    window.localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(this.roles));
  }

  public getAuthorities(): string[] {

    this.roles = [];
    let authorities:string | null = window.localStorage.getItem(AUTHORITIES_KEY);

    if (window.localStorage.getItem(TOKEN_KEY) && authorities != null) {
      JSON.parse(authorities).forEach((authority: string) => {
        this.roles.push(authority);
      });
    }
    return this.roles;
  }


  public logOut(): void {
    window.localStorage.clear();
    window.location.reload();
  }

  getIsRefresh(): boolean {
    return this.isRefresh;
  }
}
