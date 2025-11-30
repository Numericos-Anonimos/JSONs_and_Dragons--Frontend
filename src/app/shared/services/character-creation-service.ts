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

  // loadOptionsFromAPI(choiceIndex: number, query: string): void {
  //   this.loading[choiceIndex] = true;
    
  //   // Substitua pela sua URL da API
  //   this.http.get<string[]>(`api/${query}`).subscribe({
  //     next: (data) => {
  //       this.loadedOptions[choiceIndex] = data;
  //       this.loading[choiceIndex] = false;
  //     },
  //     error: (err) => {
  //       console.error(`Erro ao carregar opções para ${query}:`, err);
  //       // Mock para desenvolvimento
  //       this.loadedOptions[choiceIndex] = ['Espada Longa', 'Machado de Batalha', 'Lança', 'Martelo de Guerra'];
  //       this.loading[choiceIndex] = false;
  //     }
  //   });
  // }

}
