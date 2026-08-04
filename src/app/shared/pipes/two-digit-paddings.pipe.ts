import { Pipe, PipeTransform, Input } from '@angular/core';
import { isNil } from 'ramda';

@Pipe({
  name: 'thoDigitPaddings'
})
export class ThoDigitPipe implements PipeTransform {

  @Input() maxLengthPad = 2;
  @Input() fillString = '0';

  transform(value: string | number): string {
    if (!isNil(value)) {
      return parseFloat(('' + value)).toFixed(this.maxLengthPad);
    }
    return null;
  }

}
