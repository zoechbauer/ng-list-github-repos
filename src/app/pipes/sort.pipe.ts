import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: any, propName: string, sortOrder: string = 'asc'): unknown {
    if (value === null || value.length === 0 || propName === '') {
      return null;
    }
    return value.sort((a, b) => {
      // console.log('sort', a, b);
      const propA =
        a[propName] !== undefined ? a[propName].toLocaleLowerCase() : '';
      const propB =
        b[propName] !== undefined ? b[propName].toLocaleLowerCase() : '';
      if (
        sortOrder.toLocaleLowerCase() === 'd' ||
        sortOrder.toLocaleLowerCase() === 'desc'
      ) {
        return propA < propB ? 1 : -1;
      } else {
        return propA > propB ? 1 : -1;
      }
    });
  }
}
