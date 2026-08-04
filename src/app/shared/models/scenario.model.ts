export class Scenario {
  id: number;
  descrizione: string;
  dataPricing: Date | string;
  cedola: any;
  curva: any;
  sottocategoria: any;
  stato: StatoScenario;
  flagValidato: boolean;
  contenitori?: ContenitoreScenario[];
}

export class StatoScenario {
  codice: string;
  descrizione: string;
}

export class DettaglioScenario {
  lowerValue: number;
  middleValue: number;
  upperValue: number;
  tenor: string;
  dataRiferimento: Date;
}

export class ContenitoreScenario {
  tipologia: TipoScenario;
  dettagli: DettaglioScenario[];
}

export class TipoScenario {
  id: number;
  codice: string;
  descrizione: string;
  colore?: string;
}

export class TipoValoreDettaglioScenario {
  codice: string;
  descrizione: string;
}

export class TipoMaturity {
  codice: string;
  descrizione: string;
}
