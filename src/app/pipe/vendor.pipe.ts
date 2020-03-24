import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vendor'
})
export class VendorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
