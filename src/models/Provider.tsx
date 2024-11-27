export interface Provider {
  ProviderID: number; // Auto-incrementing primary key
  ProviderName: string; // Required
  PhoneNumber?: string; // Optional
}
