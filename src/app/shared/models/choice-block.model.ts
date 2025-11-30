import { ChoiceOption } from "./choice-option.model"

export class ChoiceBlock {
  constructor(
    label: string,
    offsets: number[],
    opcoes: ChoiceOption[] | string[],
    relacao: number[],
    tam: number
  ) {}
}