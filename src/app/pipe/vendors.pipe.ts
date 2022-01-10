import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vendors'
})
export class VendorsPipe implements PipeTransform {

  transform(items: any[], vendors: string): any {
    if (!items || !vendors) {
        return items;
    }
    console.log(vendors);
    const regExp = new RegExp(vendors, 'ig');
    const check = v => {
        return regExp.test(v.VendorName) ||
        regExp.test(v.VendorName)
    };
    return items[0].filter(check);

}

}
