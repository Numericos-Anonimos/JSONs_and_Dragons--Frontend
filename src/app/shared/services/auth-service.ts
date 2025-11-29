import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'jwt_token';

  constructor() {}

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;
    return true;

    // Optional: verify expiration if decode the JWT
    // const payload = JSON.parse(atob(token.split('.')[1]));
    // const exp = payload.exp;
    // return Date.now() < exp * 1000;
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }
}
