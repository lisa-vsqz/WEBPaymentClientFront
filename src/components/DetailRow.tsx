import React from "react";
import { Invoice } from "../models/Invoice";

interface DetailRowProps {
  dataItem: Invoice & { details?: Invoice[] };
}

const DetailRow: React.FC<DetailRowProps> = ({ dataItem }) => {
  const details = dataItem.details || []; // Ensure details is at least an empty array

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const formatDate = (date: string): string =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        className="k-detail-table"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ background: "#f4f4f4", textAlign: "left" }}>
            <th style={{ padding: "8px", borderBottom: "none" }}>
              Invoice Number
            </th>
            <th style={{ padding: "8px", borderBottom: "none" }}>Due Date</th>
            <th style={{ padding: "8px", borderBottom: "none" }}>Total</th>
            <th style={{ padding: "8px", borderBottom: "none" }}>
              Amount Paid
            </th>
            <th style={{ padding: "8px", borderBottom: "none" }}>Amount Due</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail) => (
            <tr key={detail.invoiceId} style={{ textAlign: "left" }}>
              <td style={{ padding: "8px", borderBottom: "none" }}>
                {detail.invoiceReference}
              </td>
              <td style={{ padding: "8px", borderBottom: "none" }}>
                {formatDate(new Date(detail.dueDate).toLocaleDateString())}
              </td>
              <td style={{ padding: "8px", borderBottom: "none" }}>
                {formatCurrency(detail.total)}
              </td>
              <td style={{ padding: "8px", borderBottom: "none" }}>
                {formatCurrency(detail.amountPaid)}
              </td>
              <td style={{ padding: "8px", borderBottom: "none" }}>
                {formatCurrency(detail.amountDue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailRow;
