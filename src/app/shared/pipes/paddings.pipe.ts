import { Pipe, PipeTransform, Input } from '@angular/core';

@Pipe({
  name: 'paddings'
})
export class PaddingsPipe implements PipeTransform {

  @Input() maxLengthPad = 4;
  @Input() fillString = '0';

  transform(value: string | number): string {
    return value !== null && value !== undefined ? ('' + value).padEnd(this.maxLengthPad, this.fillString) : null;
  }

}
