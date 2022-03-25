import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'floor',
})
export class FloorPipe implements PipeTransform {
  transform(value: string | undefined): unknown {
    if (value === undefined) {
      return value;
    }
    const index = value.indexOf('.');
    const numString = value.substring(0, index);

    return Number(numString).toLocaleString();
  }
}
