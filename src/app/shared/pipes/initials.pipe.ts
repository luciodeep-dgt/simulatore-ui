import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'initials'
})

export class InitialsPipe implements PipeTransform {
  transform(value: string) {
    return value ? value.charAt(0).toUpperCase() : '';
  }
}
