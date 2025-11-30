import { Atributos } from "./atributos.model";

export interface CriarFichaRequest {
  nome: string;
  atributos: Atributos;
}