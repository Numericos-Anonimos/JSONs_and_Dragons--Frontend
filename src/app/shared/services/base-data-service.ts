import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth-service";

@Injectable({ providedIn: 'root' })
export class BaseDataService {
  private baseUrl = `${environment.apiUrl}/base`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private buildHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const headers: any = { 'Content-Type': 'application/json' };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headers);
  }

  getClasses(): Observable<any> {
    const url = `${this.baseUrl}/classes/keys`;
    return this.http.get<any>(url, { headers: this.buildHeaders() });
  }

  getSubclasses(classe: string): Observable<any> {
    const url = `${this.baseUrl}/subclasses/${classe}/keys`;
    return this.http.get<any>(url, { headers: this.buildHeaders() });
  }

  getRaces(): Observable<any> {
    const url = `${this.baseUrl}/racas/keys`;
    return this.http.get<any>(url, { headers: this.buildHeaders() });
  }

  getSubraces(race: string): Observable<any> {
    const url = `${this.baseUrl}/subraca/${race}/keys`;
    return this.http.get<any>(url, { headers: this.buildHeaders() });
  }

  getSpells(classe: string, level: string): Observable<any> {
    const url = `${this.baseUrl}/magias/${classe}/${level}/keys`;
    return this.http.get<any>(url, { headers: this.buildHeaders() });
  }

  getLanguages(): Observable<any> {
    const url = `${this.baseUrl}/idiomas/keys`;
    return this.http.get<any>(url, { headers: this.buildHeaders() });
  }

  getBackgrounds(): Observable<any> {
    const url = `${this.baseUrl}/backgrounds/keys`;
    return this.http.get<any>(url, { headers: this.buildHeaders() });
  }
}