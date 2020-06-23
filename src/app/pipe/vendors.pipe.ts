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
    const check = v => {
        return regExp.test(v.vendorname) ||
        regExp.test(v.vendorname) 
    };
    return items.filter(check);

}

}
