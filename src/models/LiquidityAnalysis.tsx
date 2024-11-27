export interface LiquidityAnalysis {
  LiquidityID: number; // Auto-incrementing primary key
  AnalysisDate: Date; // Required
  BankBalance: number; // Required
  PendingPayments: number; // Required
  LiquidityStatus: string; // Required
  SuggestedPaymentDate?: Date; // Optional
  CreatedAt: Date; // Default to current datetime
}
