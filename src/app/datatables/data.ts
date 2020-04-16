import { ɵangular_packages_platform_browser_dynamic_platform_browser_dynamic_a } from '@angular/platform-browser-dynamic';

export class Vendor {
  vendorpKid: number;
  vendoruno: number;
  vendornumber: number;
  vendorid: string;
  vendorname: string;
  nameuno: number;
  vendortypecode: string;
  addressUno: number;
  address1: string;
  address2: string;
  city: string;
  State: string;
  postalcode: string;
  note: string;
  active: boolean;
  activefromdate: Date;
  modifieddate: Date;
  modifiedBy: string;
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

