import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth-service";
import { CriarFichaRequest } from "../models/criar-ficha-request.model";

@Injectable({ providedIn: 'root' })
export class CharacterCreationService {
  private baseUrl = `${environment.apiUrl}/criar`;

  constructor(
    private http: HttpClient,
    private authService: AuthService) {}

  sendClass(classe: string, level: string): Observable<any> {
    const url = `${this.baseUrl}/ficha/classe/${classe}/${level}`;

    const token = this.authService.getToken();

    const headers = token ? new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }) : new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(url, { headers });
  }

  sendRace(id: string, race: string): Observable<any> {
    const url = `${this.baseUrl}/ficha/${id}/raca/${race}`;

    const token = this.authService.getToken();

    const headers = token ? new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }) : new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, {}, { headers });
  }

createCharacter(ficha: CriarFichaRequest): Observable<any> {
    const url = `${this.baseUrl}/ficha/`;

    const token = this.authService.getToken();

    const headers = token ? new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }) : new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, ficha, { headers });
  }
}
