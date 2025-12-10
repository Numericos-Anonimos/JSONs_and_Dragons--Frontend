import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth-service";
import { CharacterResponse } from "../models/character-response.model";

@Injectable({ providedIn: 'root' })
export class CharacterSheetsService {
  private baseUrl = `${environment.apiUrl}/pegar`;

  private buildHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const headers: any = { 'Content-Type': 'application/json' };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return new HttpHeaders(headers);
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAllSheets(): Observable<any> {
    const url = `${this.baseUrl}/fichas`;
    return this.http.get(url, { headers: this.buildHeaders() });
  }

  getSheetbyId(id: string): Observable<CharacterResponse> {
    const url = `${this.baseUrl}/fichas/${id}`;
    return this.http.get<CharacterResponse>(url, { headers:this.buildHeaders() });
  }

  exportSheet(id: string): Observable<any> {
    const url = `${this.baseUrl}/fichas/${id}/export`;
    return this.http.get<any>(url, { headers:this.buildHeaders() });
  }
}