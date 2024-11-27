"use client";

import * as React from "react";
import { ButtonGroup, Button } from "@progress/kendo-react-buttons";
import { Grid, Column, ColumnMenu } from "../../components/Grid";
import {
  DateCell,
  FullNameCell,
  CurrencyCell,
} from "../../components/GridCells";
import SearchInput from "../../components/SearchInput";
import { InputChangeEvent } from "@progress/kendo-react-inputs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";
import { Invoice } from "@models/Invoice";
import { Provider } from "@models/Provider";

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_FRONT_URL;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const BusinessPayments: React.FC<Record<string, never>> = () => {
  const { data: session, status } = useSession(); // Get session and authentication status
  const router = useRouter();
  const [data, setData] = React.useState<Invoice[]>([]); // Initial state for invoices
  const [allColumnFilter, setAllColumnFilter] = React.useState<string>("");

  // Redirect unauthenticated users to the login page
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`${ADMIN_URL}/auth/signin`);
    }
  }, [status, router]);

  // Fetch invoices and providers, then merge the data
  const fetchInvoicesAndProviders = React.useCallback(async () => {
    try {
      // Fetch invoices
      const invoicesResponse = await fetch(`${BACKEND_URL}/api/invoices`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      if (!invoicesResponse.ok) {
        throw new Error(
          `Failed to fetch invoices: ${invoicesResponse.statusText}`
        );
      }

      const invoices: Invoice[] = await invoicesResponse.json();

      // Fetch providers
      const providersResponse = await fetch(`${BACKEND_URL}/api/providers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      if (!providersResponse.ok) {
        throw new Error(
          `Failed to fetch providers: ${providersResponse.statusText}`
        );
      }

      const providers: Provider[] = await providersResponse.json();

      // Normalize providerID and merge data
      const mergedData = invoices
        .filter((invoice) => invoice.AmountDue > 0) // Filter invoices with AmountDue > 0
        .map((invoice) => {
          const provider = providers.find(
            (p) => String(p.ProviderID) === String(invoice.ProviderID)
          );
          return {
            ...invoice,
            providerName: provider ? provider.ProviderName : "Unknown Provider",
          };
        });

      setData(mergedData);
    } catch (error) {
      console.error("Error fetching invoices and providers:", error);
      alert("Failed to load data. Please try again later.");
    }
  }, [session]);

  // Fetch data on component mount
  React.useEffect(() => {
    if (status === "authenticated") {
      fetchInvoicesAndProviders();
    }
  }, [status, fetchInvoicesAndProviders]);

  const handleAdminConsoleClick = () => {
    router.push(`${ADMIN_URL}/admin/userscrud`);
  };

  const onAllColumnFilterChange = React.useCallback(
    (event: InputChangeEvent) => {
      setAllColumnFilter(event.value);
    },
    []
  );

  // Prevent rendering until session status is resolved
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Prevent rendering if unauthenticated
  if (status === "unauthenticated") {
    return null; // Redirection is handled in useEffect
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
              <SearchInput
                value={allColumnFilter}
                onChange={onAllColumnFilterChange}
              />
              {session?.user?.role === "client" && (
                <Button
                  onClick={() => {}}
                  className="btn btn-lg pe-button pe-primary ml-2"
                >
                  Pay
                </Button>
              )}
              {session?.user?.role === "admin" && (
                <Button
                  onClick={handleAdminConsoleClick}
                  className="btn btn-lg pe-button pe-primary ml-2"
                >
                  Admin Console
                </Button>
              )}
              <Button
                onClick={() => router.push("/business_payments/report")}
                className="ml-10 btn btn-lg pe-button pe-primary ml-2"
              >
                Report
              </Button>
              <LogoutButton />
            </ButtonGroup>
          </div>
        </div>

        <div className="grid-placeholder shadow-box-grid">
          <div className="k-widget k-grid k-display-block custom-grid-styles">
            <div className="k-grid-content">
              <Grid
                data={data}
                onDataChange={setData}
                allColumnFilter={allColumnFilter}
              >
                <Column
                  field="providerName" // Show providerName instead of contactId
                  title="Provider"
                  columnMenu={ColumnMenu}
                  width={230}
                  cell={FullNameCell}
                />
                <Column
                  field="InvoiceNumber"
                  title="Invoice Number"
                  columnMenu={ColumnMenu}
                  width={230}
                />
                <Column
                  field="DueDate"
                  title="Due Date"
                  columnMenu={ColumnMenu}
                  width={170}
                  cell={DateCell}
                />
                <Column
                  field="TotalAmount"
                  title="Total"
                  columnMenu={ColumnMenu}
                  width={170}
                  cell={CurrencyCell}
                  filter="numeric"
                />
                <Column
                  field="AmountPaid"
                  title="Amount Paid"
                  columnMenu={ColumnMenu}
                  width={170}
                  cell={CurrencyCell}
                  filter="numeric"
                />
                <Column
                  field="AmountDue"
                  title="Amount Due"
                  columnMenu={ColumnMenu}
                  width={170}
                  cell={CurrencyCell}
                  filter="numeric"
                />
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPayments;
