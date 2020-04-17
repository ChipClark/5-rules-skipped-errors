import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], search: string): any {
    if (!items || !search) {
        return items;
    }
    console.log("in search");
    const regExp = new RegExp(search, 'gi');
    const check = v => {
        // if (this.checkPhone(p, regExp)) { return true; }
        return regExp.test(v.vendorname) ||
            regExp.test(v.city) 
    };
    return items.filter(check);

}

}
