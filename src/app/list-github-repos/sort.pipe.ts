import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: any, propName: string, sortOrder: string = 'asc'): unknown {
    if (value.length === 0 || propName === '') {
      return null;
    }
    return value.sort((a, b) => {
      if (
        sortOrder.toLocaleLowerCase() === 'd' ||
        sortOrder.toLocaleLowerCase() === 'desc'
      ) {
        return a[propName] < b[propName] ? 1 : -1;
      } else {
        return a[propName] > b[propName] ? 1 : -1;
      }
    });
  }
}
