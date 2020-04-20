import { ɵangular_packages_platform_browser_dynamic_platform_browser_dynamic_a } from '@angular/platform-browser-dynamic';

export class Vendor {
  vendortransactionid: number;
  vendorname: string;
  vendoruno: number;
  invoices: string;
  address1: string;
  city: string;
  citystatezip: string;
  lastpayment: Date;
  toalinvoiceamount: number;
}

export class InvoiceTransaction {
  invoicetransactionid: number;
  invoicetransactionuno: number;
  vendoruno: number;
  vendorname: string;
  invoicenumber: string;
  invoiceamount: number;
  invoicedate: string;
  invoicepaiddate: string;
  transactionpostdate: Date;
  invoiceStatus: string;
  aptypecode: string;
  transactiontype: string;
  transactionnameUno: number;
  transactioncancelled: string;
  note: string;
  active: boolean;
  activefromdate: Date;
  modifieddate: Date;
  modifiedBy: string;
}

export class InvoiceCheck {
  invoicecheckid: number;
  checktransactionuno: number;
  vendoruno: number;
  invoicetransactionUno: number;
  invoiceamount: Float32Array;
  checknumber: number;
  checkdate: Date;
  invoicetransactiondate: Date;
  documenttype: string;
  checkStatus: string;
  checknameuno: number;
  wirenumber: string;
  paymenttype: string;
  note: string;
  active: boolean;
  activefromdate: Date;
  modifieddate: Date;
  modifiedBy: string;
}

