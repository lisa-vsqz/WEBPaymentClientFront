export interface BankAccount {
  BankAccountID: number; // Auto-incrementing primary key
  AccountName: string; // Required
  InstitutionNo: string; // Required
  BranchNo: string; // Required
  AccountNo: string; // Required
  Balance: number; // Default 0
}
