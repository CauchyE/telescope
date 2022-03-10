import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimals',
})
export class DecimalsPipe implements PipeTransform {
  transform(value: string | undefined, count: number): unknown {
    if (value === undefined) {
      return value;
    }
    const index = value.indexOf('.');

    return value.substring(index, index + count + 1);
  }
}
