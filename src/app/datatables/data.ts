import { ɵangular_packages_platform_browser_dynamic_platform_browser_dynamic_a } from '@angular/platform-browser-dynamic';
import { Component } from '@angular/core';

export class Vendor {
  vendorinvoicesummaryid: number;
  vendorname: string;
  vendoruno: number;
  invoices: string;
  address1: string;
  city: string;
  citystatezip: string;
  lastpayment: Date;
  toalinvoiceamount: number;
}

export class VendorSearch {
  vendorinvoicetransactionid: number;
  vendorname: string;
  vendoruno: number;
  invoiceamount: number;
  invoicenumber: string;
  invoicedate: Date;
  invoicepaiddate: Date;
  officelocation: string;
  costcode: string;
  narrative: string;
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
  invoicenarrative: string;
  transactionpostdate: Date;
  invoiceStatus: string;
  aptypecode: string;
  transactiontype: string;
  transactionnameUno: number;
  transactioncancelled: string;
  note: string;
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

