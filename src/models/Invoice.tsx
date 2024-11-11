export class Invoice {
    invoiceId!: number; // PK
    companyId!: string; // varchar(14) FK
    billPayeeId!: number; // FK
    providerId!: string; // varchar(25) FK

    subtotal!: number; // decimal
    tax!: number; // decimal
    discount!: number; // decimal
    total!: number; // decimal
    amountDue!: number; // decimal
    amountPaid!: number; // decimal

    dateCreated!: Date; // date
    dateUpdated!: Date; // date

    status!: string; // varchar(1)
    currency!: string; // varchar(3)

    extInvoiceID!: string; // varchar(36)
    invoiceReference!: string; // varchar(10)
    userNumber!: string; // varchar(21)

    createdBy!: string; // varchar(14)
    updatedBy!: string; // varchar(14)

    extUserID!: string; // varchar(36)
    memo?: string; // string, optional
    note?: string; // string, optional

    selected!: boolean; //for grid

    constructor(data: Partial<Invoice> = {}) {
        Object.assign(this, data);
    }
}
