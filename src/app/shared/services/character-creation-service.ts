import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class CharacterCreationService {
  private baseUrl = `${environment.apiUrl}/criar`;

  constructor(private http: HttpClient) {}

  sendClass(classe: string, level: string): Observable<any> {
    const url = `${this.baseUrl}/ficha/classe/${classe}/${level}`;
    return this.http.get<any>(url);
  }

  sendRace(race:string): Observable<any> {
    const url = `${this.baseUrl}/ficha/raca/${race}`;
    return this.http.get<any>(url);
  }

}
