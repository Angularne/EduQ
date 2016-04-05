import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {
  transform(value: number | number[], args: any[] = null) : number[] {
    var min: number;
    var max: number;

    if (value instanceof Array && value.length == 2 && !isNaN(+value[0]) && !isNaN(+value[1])) {
      // Array
      min = value[0];
      max = value[1];
    } else if (!isNaN(+value)){
      // number
      min = 1;
      max = value as number;
    } else {
      //throw error;
      console.error('Error: invalid pipe input. Expected number or number[]');
      console.error(value);
      return;
    }
    var range : number[] = [];

    for (var i = min; i <= max; i++) {
      range.push(i);
    }
    return range;
  }
}
