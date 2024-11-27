// ColumnMenu.tsx
import React from "react";
import {
  GridColumnProps,
  GridColumnMenuFilter,
} from "@progress/kendo-react-grid";

interface ColumnMenuProps {
  column: GridColumnProps;
}

const ColumnMenu: React.FC<ColumnMenuProps> = ({ column }) => (
  <div>
    <GridColumnMenuFilter
      column={column}
      filterOperators={{
        text: [
          { text: "Contains", operator: "contains" },
          { text: "Does not contain", operator: "doesnotcontain" },
          { text: "Starts with", operator: "startswith" },
          { text: "Ends with", operator: "endswith" },
          { text: "Is equal to", operator: "eq" },
          { text: "Is not equal to", operator: "neq" },
        ],
        numeric: [
          { text: "Is equal to", operator: "eq" },
          { text: "Is not equal to", operator: "neq" },
          { text: "Greater than", operator: "gt" },
          { text: "Less than", operator: "lt" },
        ],
      }}
    />
  </div>
);

export default ColumnMenu;
