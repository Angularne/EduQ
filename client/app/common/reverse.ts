import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value: any[], args: any[] = null) : any[] {
    if (value instanceof Array) {
      return value.reverse();
    } else {
      return value;
    }
  }
}
