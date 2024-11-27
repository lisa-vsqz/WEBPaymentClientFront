"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { useInternationalization } from "@progress/kendo-react-intl";
import { Popup } from "@progress/kendo-react-popup";
import { Button } from "@progress/kendo-react-buttons";
//import { Badge } from '@progress/kendo-react-indicators';
//import { SvgIcon } from '@progress/kendo-react-common';
//import { filePdfIcon, fileExcelIcon } from '@progress/kendo-svg-icons';
import ActionMenu from "./ActionsMenu";
import { GridCellProps } from "@progress/kendo-react-grid";

export const InputCell: React.FC<GridCellProps> = ({ dataItem, field }) => {
  const [value, setValue] = useState<string>("");
  useEffect(() => {
    // Extract the initial value dynamically based on the field
    if (field && dataItem?.billPayee) {
      setValue(dataItem.billPayee[field] || ""); // Safely access nested properties
    }
  }, [dataItem, field]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);

    // Update the nested billPayee object safely
    if (field && dataItem?.billPayee) {
      dataItem.billPayee[field] = newValue;
    }
  };

  return (
    <td>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={(e) => e.target.select()}
        style={{
          width: "100%",
          border: "1px solid #ccc",
          boxSizing: "border-box",
          outline: "none",
          margin: "5px 0px",
          padding: "0.7rem 0.4rem",
          lineHeight: "1.5",
        }}
      />
    </td>
  );
};

interface ActionCellProps extends Partial<GridCellProps> {
  onExcelExport: () => void;
  onPdfExport: () => void;
}

export const ActionCell: React.FC<ActionCellProps> = ({
  onExcelExport,
  onPdfExport,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setShowMenu((prevShowMenu) => !prevShowMenu);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      anchorRef.current &&
      !anchorRef.current.contains(event.target as Node)
    ) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <td className="align-end">
      <div ref={anchorRef} style={{ display: "inline-block" }}>
        <Button
          icon="more-horizontal"
          onClick={toggleMenu}
          className="action-menu-button"
        />
      </div>
      {anchorRef.current && (
        <Popup
          anchor={anchorRef.current}
          show={showMenu}
          popupAlign={{ vertical: "bottom", horizontal: "right" }}
        >
          <div ref={menuRef}>
            <ActionMenu
              onExcelExport={onExcelExport}
              onPdfExport={onPdfExport}
            />
          </div>
        </Popup>
      )}
    </td>
  );
};

// interface FullNameCellProps {
//     dataItem: { contact: string };
//     rowType?: string;
// }

export const FullNameCell: React.FC<GridCellProps> = ({
  dataItem,
  rowType,
}) => {
  if (rowType === "groupHeader") return null;
  console.log(dataItem);
  const getInitials = (name: string | undefined) => {
    if (!name) {
      return ""; // Return an empty string or some default value if name is undefined
    }
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    return initials.toUpperCase();
  };

  // Determine background color based on Reason field if present, else default to blue
  const getBackgroundColor = (dataItem: any) => {
    if (dataItem?.Reason) {
      const reason = dataItem.Reason.toLowerCase(); // Normalize to lowercase
      console.log(reason);
      switch (reason) {
        case "too expensive":
          return "#FF5C5C"; // Red
        case "uncommon provider":
          return "#FFD700"; // Yellow
        case "haven't hired in a long time":
          return "#4CAF50"; // Green
        default:
          return "#2285D0"; // Default blue for unknown reasons
      }
    }
    return "#2285D0"; // Default blue when Reason is not available
  };

  const customerPhotoStyle = {
    display: "inline-block",
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: getBackgroundColor(dataItem),
    color: "white",
    fontSize: "14px",
    fontWeight: "light",
    textAlign: "center" as const,
    verticalAlign: "middle",
    lineHeight: "32px",
    marginLeft: "5px",
  };

  const customerName = {
    display: "inline-block",
    verticalAlign: "middle",
    lineHeight: "32px",
    paddingLeft: "10px",
  };

  return (
    <td>
      <div style={customerPhotoStyle}>{getInitials(dataItem.providerName)}</div>
      <div style={customerName}>{dataItem.providerName}</div>
    </td>
  );
};

// interface DateCellProps {
//     dataItem: { dueDate: Date };
//     rowType?: string;
// }
export const DateCell: React.FC<GridCellProps> = ({ dataItem, rowType }) => {
  if (rowType === "groupHeader") return null;

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return <td>{formatDate(dataItem.DueDate)}</td>;
};

// interface CurrencyCellProps {
//     dataItem: { [key: string]: number };
//     field: string;
//     rowType?: string;
// }

export const CurrencyCell: React.FC<GridCellProps> = ({ dataItem, field }) => {
  const intlService = useInternationalization();
  const redBoldStyle = {
    color: "#d9534f",
    fontWeight: 600,
  };

  if (!dataItem || !field || typeof dataItem[field] !== "number") return null;

  const value = dataItem[field] as number;

  return (
    <td>
      <span style={value < 0 ? redBoldStyle : undefined}>
        {intlService.formatNumber(value, "c")}
      </span>
    </td>
  );
};
