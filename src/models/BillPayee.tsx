// models/BillPayee.ts

export class BillPayee {
    billPayeeId!: number;
    contactId!: string;
    bankNumber!: string;
    branchNumber!: string;
    accountNumber!: string;
    peCompanyId!: string;
    clientId!: string;
    createdBy!: string;
    updatedBy!: string;
    extCompanyId!: string;
    createdByContact!: string;
    providerId!: string;
    status!: string;
    dateCreated!: Date;
    dateUpdated!: Date;

    constructor(data: Partial<BillPayee> = {}) {
        Object.assign(this, data);
    }
}
