export class BillPayee {
  billPayeeId?: number; // Made optional
  contactId?: string;
  bankNumber?: string;
  branchNumber?: string;
  accountNumber?: string;
  peCompanyId?: string;
  clientId?: string;
  createdBy?: string;
  updatedBy?: string;
  extCompanyId?: string;
  createdByContact?: string;
  providerId?: string;
  status?: string;
  dateCreated?: Date;
  dateUpdated?: Date;
  paymentNotificationEmail?: string; // New field
  institutionName?: string; // New field

  constructor(data: Partial<BillPayee> = {}) {
    Object.assign(this, data);
  }
}
