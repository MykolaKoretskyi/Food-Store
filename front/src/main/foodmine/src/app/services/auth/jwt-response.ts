export class JwtResponse {
  accessToken: string;
  refreshToken: string;
  rolesNames: string[];
  constructor(
    accessToken: string,
    refreshToken: string,
    rolesNames: string[]
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.rolesNames = rolesNames;
  }

}
