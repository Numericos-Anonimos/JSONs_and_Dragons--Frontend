import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class BaseDataService {
  private baseUrl = `${environment.apiUrl}/base`;

  constructor(private http: HttpClient) {}

  getClasses(): Observable<any> {
    const url = `${this.baseUrl}/classes/keys`;
    return this.http.get<any>(url);
  }

  getSubclasses(classe:string): Observable<any> {
    const url = `${this.baseUrl}/subclasses/${classe}/keys`;
    return this.http.get<any>(url);
  }

  getRaces(): Observable<any> {
    const url = `${this.baseUrl}/racas/keys`;
    return this.http.get<any>(url);
  }

  getSubraces(race:string): Observable<any> {
    const url = `${this.baseUrl}/subraca/${race}/keys`;
    return this.http.get<any>(url);
  }

  getSpells(classe:string, level:string): Observable<any> {
    const url = `${this.baseUrl}/magias/${classe}/${level}/keys`;
    return this.http.get<any>(url);
  }

  getLanguages(): Observable<any> {
    const url = `${this.baseUrl}/idiomas/keys`;
    return this.http.get<any>(url);
  }
  
  getBackgrounds(): Observable<any> {
    const url = `${this.baseUrl}/backgrounds/keys`;
    return this.http.get<any>(url);
  }

}
