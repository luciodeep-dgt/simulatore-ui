import { CurveDetail } from './curve-detail.model';

export class Curve {
  id: number;
  colore?: string;
  dataPricing?: Date | string;
  descrizione: string;
  dettagli: CurveDetail[];
  idSimulazione: number;
  idSottocategoria?: string;
  tipologia: CurveType;
  flagCustom?: boolean;
}


export class CurveType {
  id: string;
  colore?: string;
  descrizioneEstesa?: string;
  descrizione: string;
}
