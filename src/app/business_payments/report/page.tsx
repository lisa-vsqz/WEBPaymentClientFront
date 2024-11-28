"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Grid, Column, ColumnMenu } from "../../../components/Grid";
import {
  CurrencyCell,
  DateCell,
  FullNameCell,
} from "../../../components/GridCells";
import { DateRangePicker } from "@progress/kendo-react-dateinputs";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface LiquidityStatus {
  BankBalance: number;
  PendingPayments: number;
  LiquidityStatus: string;
  SuggestedPaymentDate: string;
}

interface ProviderToAvoid {
  ProviderID: number;
  Reason: string;
  PaymentsCount: number;
  TotalPaid: number;
}

interface Provider {
  ProviderID: number;
  ProviderName: string;
}

interface Invoice {
  ProviderID: number;
  DueDate: string;
  AmountDue: number;
}

const Report: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [liquidityStatus, setLiquidityStatus] =
    React.useState<LiquidityStatus | null>(null);
  const [suggestedPayments, setSuggestedPayments] = React.useState([]);
  const [providersToAvoid, setProvidersToAvoid] = React.useState<
    ProviderToAvoid[]
  >([]);
  const [providers, setProviders] = React.useState<Provider[]>([]);

  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [dateRange, setDateRange] = React.useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  });
  const [filteredProviders, setFilteredProviders] = React.useState<
    { providerName: string; totalOwed: number; invoiceCount: number }[]
  >([]);

  // Fetch all required data
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      // Fetch Liquidity Status
      fetch(`${BACKEND_URL}/api/liquidityanalysis/status`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      })
        .then((res) => res.json())
        .then(setLiquidityStatus)
        .catch((err) => console.error("Error fetching liquidity status:", err));

      fetch(`${BACKEND_URL}/api/invoices`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      })
        .then((res) => res.json())
        .then(setInvoices)
        .catch((err) => console.error("Error fetching invoices:", err));

      // Fetch Suggested Payments
      fetch(`${BACKEND_URL}/api/payments/suggested-payments`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      })
        .then((res) => res.json())
        .then((data) =>
          setSuggestedPayments(data.filter((payment) => payment.AmountDue > 0))
        )
        .catch((err) =>
          console.error("Error fetching suggested payments:", err)
        );

      // Fetch Providers to Avoid
      fetch(`${BACKEND_URL}/api/providers/avoid`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      })
        .then((res) => res.json())
        .then(setProvidersToAvoid)
        .catch((err) =>
          console.error("Error fetching providers to avoid:", err)
        );

      // Fetch Providers
      fetch(`${BACKEND_URL}/api/providers`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      })
        .then((res) => res.json())
        .then(setProviders)
        .catch((err) => console.error("Error fetching providers:", err));
    }
  }, [status, session, router]);

  // Map providerName into Providers to Avoid
  const processedProvidersToAvoid = React.useMemo(() => {
    return providersToAvoid.map((item) => {
      const provider = providers.find(
        (p) => String(p.ProviderID) === String(item.ProviderID)
      );
      return {
        ...item,
        providerName: provider ? provider.ProviderName : "Unknown Provider",
        Reason: item.Reason,
      };
    });
  }, [providersToAvoid, providers]);

  React.useEffect(() => {
    if (!dateRange.start || !dateRange.end) return;

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    const filteredInvoices = invoices.filter((invoice) => {
      const dueDate = new Date(invoice.DueDate);
      return (
        dueDate >= startDate && dueDate <= endDate && invoice.AmountDue > 0
      );
    });

    const providerMap = new Map<
      number,
      {
        totalOwed: number;
        invoiceCount: number;
        oldestInvoiceDate: string | null;
      }
    >();

    filteredInvoices.forEach((invoice) => {
      if (!providerMap.has(invoice.ProviderID)) {
        providerMap.set(invoice.ProviderID, {
          totalOwed: 0,
          invoiceCount: 0,
          oldestInvoiceDate: null,
        });
      }
      const providerData = providerMap.get(invoice.ProviderID);
      if (providerData) {
        providerData.totalOwed += invoice.AmountDue;
        providerData.invoiceCount += 1;
        providerData.oldestInvoiceDate =
          !providerData.oldestInvoiceDate ||
          new Date(providerData.oldestInvoiceDate) > new Date(invoice.DueDate)
            ? invoice.DueDate
            : providerData.oldestInvoiceDate;
      }
    });

    const result = Array.from(providerMap.entries())
      .map(([providerID, data]) => {
        const provider = providers.find((p) => p.ProviderID === providerID);
        return {
          providerName: provider ? provider.ProviderName : "Unknown Provider",
          totalOwed: data.totalOwed,
          invoiceCount: data.invoiceCount,
          oldestInvoiceDate: data.oldestInvoiceDate,
        };
      })
      .sort((a, b) => {
        // First order by the oldest due date
        const oldestDueDateA = new Date(a.oldestInvoiceDate || "").getTime();
        const oldestDueDateB = new Date(b.oldestInvoiceDate || "").getTime();

        if (oldestDueDateA !== oldestDueDateB) {
          return oldestDueDateA - oldestDueDateB;
        }

        // Then order by total owed
        return b.totalOwed - a.totalOwed;
      });

    setFilteredProviders(result);
  }, [dateRange, invoices, providers]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="report-container p-6 pt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        <strong>Business Payment Report</strong>
      </h1>

      {/* Liquidity Status Card */}
      {liquidityStatus && (
        <div className="mb-6 p-4 rounded-lg shadow-md bg-blue-50 border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            Liquidity Status
          </h2>
          <div className="grid grid-cols-2 gap-4 text-lg">
            <div>
              <span className="font-bold">Bank Balance:</span> $
              {liquidityStatus.BankBalance}
            </div>
            <div>
              <span className="font-bold">Pending Payments:</span> $
              {liquidityStatus.PendingPayments}
            </div>
            <div>
              <span className="font-bold">Liquidity Status:</span>{" "}
              {liquidityStatus.LiquidityStatus}
            </div>
            <div>
              <span className="font-bold">Suggested Payment Date:</span>{" "}
              {new Date(
                liquidityStatus.SuggestedPaymentDate
              ).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {/* Grids for Suggested Payments and Providers to Avoid */}
      <div className="grid grid-cols-2 gap-6 mt-10">
        {/* Suggested Payments Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            <strong>Suggested Payments</strong>
          </h2>
          <Grid
            data={suggestedPayments}
            onDataChange={() => {}}
            allColumnFilter=""
            stateHidden={true}
          >
            <Column
              field="InvoiceNumber"
              title="Invoice Number"
              columnMenu={ColumnMenu}
              width={200}
            />
            <Column
              field="AmountDue"
              title="Amount Due"
              columnMenu={ColumnMenu}
              cell={CurrencyCell}
              width={200}
            />
            <Column
              field="DueDate"
              title="Due Date"
              columnMenu={ColumnMenu}
              cell={DateCell}
              width={200}
            />
          </Grid>
        </div>

        {/* Providers to Avoid Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-red-800">
            <strong>Providers to Avoid</strong>
          </h2>
          <Grid
            data={processedProvidersToAvoid}
            onDataChange={() => {}}
            allColumnFilter=""
            stateHidden={true}
          >
            <Column
              field="providerName"
              title="Provider"
              columnMenu={ColumnMenu}
              cell={FullNameCell}
              width={250}
            />
            <Column
              field="Reason"
              title="Reason to Avoid"
              columnMenu={ColumnMenu}
              width={160}
            />
            <Column
              field="PaymentsCount"
              title="Payments Count"
              columnMenu={ColumnMenu}
              width={150}
            />
            <Column
              field="TotalPaid"
              title="Total Paid"
              columnMenu={ColumnMenu}
              cell={CurrencyCell}
              width={120}
            />
          </Grid>
        </div>
      </div>
      {/* Date Range Picker */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Date Range</h2>
        <DateRangePicker
          value={dateRange}
          onChange={(e) => setDateRange(e.value)}
          startDateInputSettings={{ label: "Start Date" }}
          endDateInputSettings={{ label: "End Date" }}
        />
      </div>

      {/* Providers with Invoices in Date Range */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Providers with Invoices in Selected Date Range
        </h2>
        {filteredProviders.length > 0 ? (
          <Grid
            data={filteredProviders}
            onDataChange={() => {}}
            allColumnFilter=""
            stateHidden={true}
          >
            <Column
              field="providerName"
              title="Provider Name"
              columnMenu={ColumnMenu}
              width={250}
            />
            <Column
              field="totalOwed"
              title="Total Owed"
              columnMenu={ColumnMenu}
              cell={CurrencyCell}
              width={200}
            />
            <Column
              field="invoiceCount"
              title="Number of Invoices"
              columnMenu={ColumnMenu}
              width={150}
            />
            <Column
              field="oldestInvoiceDate"
              title="Oldest Invoice Date"
              columnMenu={ColumnMenu}
              cell={(props) => (
                <DateCell
                  {...props}
                  dataItem={{ DueDate: props.dataItem.oldestInvoiceDate }}
                />
              )}
              width={200}
            />
          </Grid>
        ) : (
          <p>No providers found for the selected date range.</p>
        )}
      </div>
    </div>
  );
};

export default Report;
