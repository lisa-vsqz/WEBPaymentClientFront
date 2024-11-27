export interface ProviderHistory {
  ProviderHistoryID: number; // Auto-incrementing primary key
  ProviderID: number; // Foreign key
  TotalPaid: number; // Required
  PaymentsCount: number; // Required
}
