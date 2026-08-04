import { CustomOperator, quote } from 'rsql-criteria-typescript';

export class IgnoreCaseOperator implements CustomOperator {
  convertToRSQLString(
    value: string | number | boolean | (string | number | boolean)[] | Date,
    valueString: string,
    shouldQuote: boolean
  ): string {
    return '=ik=' + encodeURIComponent(shouldQuote ? quote(valueString) : valueString);
  }
}
