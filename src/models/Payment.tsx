export interface Payment {
  PaymentID: number; // Auto-incrementing primary key
  BankAccountID: number; // Foreign key
  PaymentDate: Date; // Required
  AmountPaid: number; // Required
  ProviderID: number; // Foreign key
  InvoiceID: number; // Foreign key
  PaymentNotification: boolean; // Default false
  CreatedAt: Date; // Default to current datetime
}
