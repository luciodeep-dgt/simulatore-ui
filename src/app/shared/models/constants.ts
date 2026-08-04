import { Step } from './step.enum';

export abstract class Constants {
  public static readonly MAX_DATA_PRICING = 5;
  public static readonly MAX_CEDOLE = 5;
  public static readonly CHART_COLORS = {
    BOT: '0066cc',
    BTP: 'b36800',
    BOT_FWD: 'db5b00'
  };
}


export const MAX_SUBCATEGORIES = 5;
export const STEP_PATH = {
  [Step.SUBCATEGORIES]: 'sottocategorie',
  [Step.DATA_PRICING]: 'data-pricing',
  [Step.BLENDING_PARAMS]: 'parametri-blending',
  [Step.CEDOLE]: 'cedole',
  [Step.PROFILES]: 'profili-generati'
};
