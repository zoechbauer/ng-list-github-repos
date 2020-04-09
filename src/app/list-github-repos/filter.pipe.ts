import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false,
})
export class FilterPipe implements PipeTransform {
  transform(value: any, search: string, propName: string): any {
    if (value.length === 0 || search === '') {
      return value;
    }
    const filteredArr = [];
    value.forEach((element) => {
      const propField =
        typeof element[propName] === 'string'
          ? element[propName].toLowerCase()
          : element[propName];
      const searchField =
        typeof search === 'string' ? search.toLowerCase() : search;
      //  if (element[propName].toLowerCase().includes(search.toLowerCase())) {
      if (typeof propField === 'string') {
        if (propField.includes(searchField)) {
          filteredArr.push(element);
        }
      } else {
        // how to compare Dates?
        console.log(propField, searchField);
        if (propField > searchField) {
          filteredArr.push(element);
        }
      }
    });
    return filteredArr;
  }
}
