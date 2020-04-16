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
      // console.log('a[propName]', a[propName]);

      const propA =
        typeof a[propName] === 'string'
          ? a[propName].toLocaleLowerCase()
          : a[propName];
      const propB =
        typeof b[propName] === 'string'
          ? b[propName].toLocaleLowerCase()
          : b[propName];

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
