import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth-service";

export interface Atributos {
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;
}

export interface CriarFichaRequest {
  nome: string;
  atributos: Atributos;
}

@Injectable({ providedIn: 'root' })
export class CharacterCreationService {
  private baseUrl = `${environment.apiUrl}/criar`;

  constructor(
    private http: HttpClient,
    private authService: AuthService) {}

  sendClass(classe: string, level: string): Observable<any> {
    const url = `${this.baseUrl}/ficha/classe/${classe}/${level}`;
    return this.http.get<any>(url);
  }

  sendRace(race:string): Observable<any> {
    const url = `${this.baseUrl}/ficha/raca/${race}`;
    return this.http.get<any>(url);
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
