import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth-service";
import { CriarFichaRequest } from "../models/criar-ficha-request.model";

@Injectable({ providedIn: 'root' })
export class CharacterCreationService {
  private baseUrl = `${environment.apiUrl}/criar`;

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

  sendClass(characterId: string, classe: string, level: number): Observable<any> {
    const url = `${this.baseUrl}/ficha/${characterId}/classe/${classe}/${level}`;
    return this.http.post(url, {}, { headers: this.buildHeaders() });
  }

  sendRace(characterId: string, race: string): Observable<any> {
    const url = `${this.baseUrl}/ficha/${characterId}/raca/${race}`;
    return this.http.post(url, {}, { headers: this.buildHeaders() });
  }

  sendBackground(characterId: string, background: string): Observable<any> {
    const url = `${this.baseUrl}/ficha/${characterId}/background/${background}`;
    return this.http.post(url, {}, { headers: this.buildHeaders() });
  }

  createCharacter(ficha: CriarFichaRequest): Observable<any> {
    const url = `${this.baseUrl}/ficha/`;
    return this.http.post(url, ficha, { headers: this.buildHeaders() });
  }

  getNextChoices(characterId: string, payload: any): Observable<any> {
    const url = `${this.baseUrl}/ficha/${characterId}/next`;
    return this.http.post(url, payload, { headers: this.buildHeaders() });
  }

  uploadCharacter(zipFile: File): Observable<any> {
    const url = `${this.baseUrl}/ficha/import`;
    const formData = new FormData();
    formData.append('file', zipFile, zipFile.name);
    return this.http.post(url, formData, { headers: this.buildHeaders() });
  }
}
