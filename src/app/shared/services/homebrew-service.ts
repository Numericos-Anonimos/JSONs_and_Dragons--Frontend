import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth-service";
import { CriarFichaRequest } from "../models/criar-ficha-request.model";

@Injectable({ providedIn: 'root' })
export class HomeBrewService {
  private baseUrl = `${environment.apiUrl}/homebrew`;

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

  uploadHomebrew(name: string, zipFile: File): Observable<any> {
    const url = `${this.baseUrl}/upload`;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', zipFile, zipFile.name);
    return this.http.post(url, formData, { headers: this.buildHeaders() });
  }
}
