// src/models/Bill.ts

export class Bill {
    id: number;
    contact: string;
    invoiceNumber: string;
    dueDate: Date;
    total: number;
    amountPaid: number;
    amountDue: number;
    selected: boolean;

    constructor(data: Partial<Bill>) {
        this.id = data.id ?? 0;
        this.contact = data.contact ?? '';
        this.invoiceNumber = data.invoiceNumber ?? '';
        this.dueDate = data.dueDate ?? new Date();
        this.total = data.total ?? 0;
        this.amountPaid = data.amountPaid ?? 0;
        this.amountDue = data.amountDue ?? this.total - this.amountPaid;
        this.selected = data.selected ?? false;
    }

    // Example method to format the due date
    formatDueDate(): string {
        return this.dueDate.toLocaleDateString('en-US');
    }

    // Check if the bill is fully paid
    isFullyPaid(): boolean {
        return this.amountDue === 0;
    }
}
