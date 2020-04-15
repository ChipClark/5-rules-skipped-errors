import { ɵangular_packages_platform_browser_dynamic_platform_browser_dynamic_a } from '@angular/platform-browser-dynamic';

export class Vendor {
  vendorpKid: number;
  vendorUno: number;
  vendornumber: number;
  vendorid: string;
  vendorname: string;
  nameUno: number;
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
  invoicetransactionUno: number;
  vendorUno: number;
  invoicenumber: string;
  invoiceamount: Float32Array;
  invoicedate: string;
  invoicepaiddate: string;
  transactionpostdate: string;
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
  checktransactionUno: number;
  vendorUno: number;
  invoicetransactionUno: number;
  invoiceamount: Float32Array;
  checknumber: number;
  checkdate: Date;
  invoicetransactiondate: Date;
  documenttype: string;
  checkStatus: string;
  checknameUno: number;
  wirenumber: string;
  paymenttype: string;
  note: string;
  active: boolean;
  activefromdate: Date;
  modifieddate: Date;
  modifiedBy: string;
}

