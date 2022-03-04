import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], search: string): any {
    if (!items || !search) {
        return items;
    }

    const regExp = new RegExp(search, 'gi');
    const check = (v: { VendorName: string; City: string; }) => {
        // if (this.checkPhone(p, regExp)) { return true; }
        return regExp.test(v.VendorName) ||
            regExp.test(v.City)
    };
    return items.filter(check);

}

}
