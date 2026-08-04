import { TaxType } from './tax-type.model';
export class Cedola {
  id: string;
  descrizione: string;
  prodotti: {
    id: string;
    idAttivita: number;
    tassi: CedolaDetail[];
    descrizione: string;
  }[];
}

export class CedolaDetail {
  dataRiferimento: Date;
  valoreNominale: number;
  valoreEffettivo: number;
  id?: string;
  idCedola?: string;
  idProdotto?: string;
  tenor?: string;
}

export class CedolaChangeModel {
  currentVal: string;
  currentType: 'NOMINALE' | 'EFFETTIVO';
  currentDetail: CedolaDetail;
}
