export interface Invoice {
  InvoiceID: number; // Auto-incrementing primary key
  ProviderID: number; // Foreign key
  InvoiceNumber: string; // Required
  DueDate: Date; // Required
  TotalAmount: number; // Required
  AmountPaid: number; // Default 0
  AmountDue: number; // Calculated field (totalAmount - amountPaid)
  PaymentStatus: string; // Default 'Unpaid'
  CreatedAt: Date; // Default to current datetime
  UpdatedAt: Date; // Default to current datetime
  selected: boolean; // Default false
}
