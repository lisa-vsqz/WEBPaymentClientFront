"use client"; // Ensures this is a Client Component

import * as React from 'react';
import { ButtonGroup, Button } from '@progress/kendo-react-buttons';
import { Grid, Column, ColumnMenu } from '../../components/Grid';
import { DateCell, FullNameCell, CurrencyCell } from '../../components/GridCells';
import { dummydata, dummydataPayees } from '../resources/dummydata';
import { Invoice } from '../../models/Invoice';
import { BillPayee } from '../../models/BillPayee';
import SearchInput from '../../components/SearchInput';
import { InputChangeEvent } from '@progress/kendo-react-inputs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LogoutButton from '../../components/LogoutButton';

const mergeData = (invoices: Invoice[], payees: BillPayee[]): (Invoice & { contactId?: string })[] => {
    return invoices.map(invoice => {
        const payee = payees ? payees.find(p => p.billPayeeId === invoice.billPayeeId) : undefined;
        return { ...invoice, contactId: payee ? payee.contactId : undefined };
    });
};

const BusinessPayments: React.FC<Record<string, never>> = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [data, setData] = React.useState(() => mergeData(dummydata, dummydataPayees));
    const [allColumnFilter, setAllColumnFilter] = React.useState<string>('');

    React.useEffect(() => {
        if (status === "authenticated") {
            // No redirect needed, user is authenticated
        } else if (status === "unauthenticated") {
            // Redirect to login if unauthenticated
            router.push('http://localhost:3001/auth/signin');
        }
    }, [status, router]);
    

    const handleAdminConsoleClick = () => {
        router.push('http://localhost:3001/userscrud');
    };

    const onAllColumnFilterChange = React.useCallback((event: InputChangeEvent) => {
        setAllColumnFilter(event.value);
    }, []);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        // Optional: you could also navigate to login here, but the useEffect should already handle it
        return null;
    }

    return (
        <div id="Grid" className="main-content">
            <div className="pe-grid-container grid-container-parent">
                <div className="grid-header flex justify-between">
                    <div className="grid-title">
                        <div className="pe-secundary dropdown pointer relative">
                            <h3>Business Payment</h3>
                        </div>
                    </div>
                    <div className="grid-actions flex items-center">
                        <ButtonGroup>
                            <SearchInput value={allColumnFilter} onChange={onAllColumnFilterChange} />
                            
                            <LogoutButton></LogoutButton>
                            {session?.user?.role === 'client' && (
                                <Button
                                onClick={() => {}}
                                className="btn btn-lg pe-button pe-primary ml-2"
                            >
                                Pay
                            </Button>
                            )}
                            {session?.user?.role === 'admin' && (
                                <Button onClick={handleAdminConsoleClick} className="btn btn-lg pe-button pe-primary ml-2">
                                    Admin Console
                                </Button>
                            )}
                        </ButtonGroup>
                    </div>
                </div>

                <div className="grid-placeholder shadow-box-grid">
                    <div className='k-widget k-grid k-display-block custom-grid-styles'>
                        <div className="k-grid-content">
                            <Grid data={data} onDataChange={setData} allColumnFilter={allColumnFilter} >
                                <Column field="contactId" title="Contact" columnMenu={ColumnMenu} width={230} cell={FullNameCell} />
                                <Column field="invoiceReference" title="Invoice Number" columnMenu={ColumnMenu} width={230} />
                                <Column field="dateCreated" title="Due Date" columnMenu={ColumnMenu} width={170} cell={DateCell} />
                                <Column field="total" title="Total" columnMenu={ColumnMenu} width={170} cell={CurrencyCell} filter="numeric" />
                                <Column field="amountPaid" title="Amount Paid" columnMenu={ColumnMenu} width={170} cell={CurrencyCell} filter="numeric" />
                                <Column field="amountDue" title="Amount Due" columnMenu={ColumnMenu} width={170} cell={CurrencyCell} filter="numeric" />
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessPayments;
