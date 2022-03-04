import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vendors'
})
export class VendorsPipe implements PipeTransform {

  transform(items: any[], vendors: string): any {
    if (!items || !vendors) {
        return items;
    }
    const regExp = new RegExp(vendors, 'ig');
    const check = (v: { VendorName: string; }) => {
        return regExp.test(v.VendorName) ||
        regExp.test(v.VendorName)
    };
    return items[0].filter(check);

}

}
