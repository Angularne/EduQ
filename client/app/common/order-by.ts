
import { Pipe,PipeTransform } from "@angular/core";

//We tell Angular that this is a pipe by applying the @Pipe decorator which we import from the core Angular library.

@Pipe({

  //The @Pipe decorator takes an object with a name property whose value is the pipe name that we'll use within a template expression. It must be a valid JavaScript identifier. Our pipe's name is orderby.

  name: "orderby"
})

export class OrderByPipe implements PipeTransform {
  transform(array:Array<any>, args?) {

    // Check if array exists, in this case array contains articles and args is an array that has 1 element : !id

    if(array) {

      // get the first element

      let orderByValue = args[0]
      let byVal = 1

      // check if exclamation point

      if(orderByValue.charAt(0) == "!") {

        // reverse the array

        byVal = -1
        orderByValue = orderByValue.substring(1)
      }
      console.log("byVal",byVal);
      console.log("orderByValue",orderByValue);
      console.log(array);

      array.sort((a: any, b: any) => {
        console.log("sort started");

        console.log(a);
        console.log(b);

        if(a[orderByValue] < b[orderByValue]) {
          return -1*byVal;
        } else if (a[orderByValue] > b[orderByValue]) {
          return 1*byVal;
        } else {
          return 0;
        }
      });
      console.log("sort done");
      return array;
    }

    //
  }
}
