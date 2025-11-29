import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class CharacterCreationService {
  private baseUrl = `${environment.apiUrl}/base`;

  constructor(private http: HttpClient) {}

//   postAttributes(): Observable<string[]> {
//     return this.http.post<string[]>(this.baseUrl);
//   }

//   getUser(id: string): Observable<User> {
//     const url = `${this.baseUrl}/${id}`;
//     return this.http.get<User>(url);
//   }

  getItems(): Observable<string> {
    const url = `${this.baseUrl}/itens/`;
    return this.http.get<string>(url);
  }
}
