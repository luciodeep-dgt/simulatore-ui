import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toString'
}) export class ToStringPipe implements PipeTransform {

  transform(input: number): string {
    return input !== null && input !== undefined && !isNaN(input) ? input.toString() : null;
  }
}
