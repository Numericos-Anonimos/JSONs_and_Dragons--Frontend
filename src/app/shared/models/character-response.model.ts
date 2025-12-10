export interface CharacterResponse {
  header: Header;
  attributes: Attributes;
  skills: Skill[];
  combat: Combat;
  attacks: Attack[];
  equipment: Equipment[];
  features: Feature[];
}

export interface Header {
  name: string;
  race: string;
  class_level: any;
  background: string;
  id: string;
}

export interface Attributes {
  str: AttributeDetail;
  dex: AttributeDetail;
  con: AttributeDetail;
  int: AttributeDetail;
  wis: AttributeDetail;
  cha: AttributeDetail;
}

export interface AttributeDetail {
  score: number;
  modifier: number;
  save: number;
}

export interface Skill {
  name: string;
  attribute: string;
  bonus: number;
  roll: string;
}

export interface Combat {
  hp_max: number;
  temp_hp: number;
  ac: number;
  initiative: number;
  speed: string;
  proficiency_bonus: number;
}

export interface Attack {
  name?: string;
  bonus?: number;
  damage?: string;
  range?: string;
}

export interface Equipment {
  name: string;
  amount: number;
  description: string;
}

export interface Feature {
  name: string;
  description: string;
  counter: number;
}
