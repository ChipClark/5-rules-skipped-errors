import { ɵangular_packages_platform_browser_dynamic_platform_browser_dynamic_a } from '@angular/platform-browser-dynamic';
import { Component } from '@angular/core';

export class Vendor {
  VendorInvoiceSummaryID!: number;
  VendorID!: number;
  VendorName!: string;
  VendorUno!: number;
  VendorTypeCode!: string;
  Invoices!: number;
  Address1!: string;
  Address2!: string;
  City!: string;
  CityStateZip!: string;
  State!: string;
  PostalCode!: string;
  LastPayment!: Date;
  TotalInvoiceAmount!: number;
  InvoiceTransaction!: InvoiceTransaction[];
}

export class VendorSearch {
  vendorInvoiceTransactionid!: number;
  VendorName!: string;
  VendorUno!: number;
  InvoiceAmount!: number;
  InvoiceNumber!: string;
  InvoiceDate!: Date;
  InvoicePaidDate!: Date;
  OfficeLocation!: string;
  Costcode!: string;
  Narrative!: string;
}

export class InvoiceTransaction {
  InvoiceTransactionID!: number;
  InvoiceTransactionUno!: number;
  VendorName!: string;
  VendorUno!: number;
  InvoiceAmount!: number;
  InvoiceNumber!: string;
  InvoiceDate!: Date;
  InvoicePaidDate!: Date;
  DisbursementAmount!: number;
  OfficeLocation!: string;
  Costcode!: string;
  CombinedNarrative!: string;
  InvoiceNarrative!: string;
  TransactionPostDate!: Date;
  InvoiceStatus!: string;
  APTypeCode!: string;
  Transactiontype!: string;
  TransactionNameUno!: number;
  TransactionCancelled!: string;
  Note!: string;
  InvoiceAmountFixed!: string;
}

export class InvoiceCheck {
  InvoiceCheckID!: number;
  CheckTransactionUno!: number;
  VendorUno!: number;
  InvoiceTransactionUno!: number;
  InvoiceAmount!: Float32Array;
  CheckNumber!: number;
  CheckDate!: Date;
  InvoiceTransactionDate!: Date;
  DocumentType!: string;
  CheckStatus!: string;
  CheckNameUno!: number;
  WireNumber!: string;
  PaymentType!: string;
  Note!: string;
  Active!: boolean;
  ActiveFromDate!: Date;
  ModifiedDate!: Date;
  ModifiedBy!: string;
}

