import React from "react";
import {
  Grid as KendoGrid,
  GridColumn,
  // GridColumnMenuSort,
  GridColumnMenuFilter,
  GridDataStateChangeEvent,
  GridColumnProps,
  GridSelectionChangeEvent,
  GridHeaderSelectionChangeEvent,
} from "@progress/kendo-react-grid";
import { GridPDFExport } from "@progress/kendo-react-pdf";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import {
  process,
  State,
  CompositeFilterDescriptor,
  SortDescriptor,
  GroupDescriptor,
} from "@progress/kendo-data-query";
//import { Input, InputChangeEvent } from '@progress/kendo-react-inputs';
import { ActionCell } from "./GridCells";
import HeaderActionCell from "./HeaderActionsCell";
import { Invoice } from "../models/Invoice";

export const Column = GridColumn;

// Custom ColumnMenu component
interface ColumnMenuProps {
  column: GridColumnProps;
}

export const ColumnMenu: React.FC<ColumnMenuProps> = ({ column }) => (
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

// GridProps interface for the main component
interface GridProps {
  data: Invoice[] | (Invoice & { details?: Invoice[]; expanded?: boolean })[]; // Support both plain Invoice and expandable rows
  onDataChange: (
    data: Invoice[] | (Invoice & { details?: Invoice[]; expanded?: boolean })[]
  ) => void;
  style?: React.CSSProperties;
  detail?: (props: {
    dataItem: Invoice & { details?: Invoice[]; expanded?: boolean };
  }) => React.ReactNode;
  children: React.ReactNode;
  allColumnFilter: string;
  onExpandChange?: (event: any) => void;
  expandField?: string;
  stateHidden?: boolean; // Control visibility of selection column
}

export const Grid: React.FC<GridProps> = (props) => {
  const {
    data,
    onDataChange,
    detail,
    allColumnFilter,
    stateHidden = false,
    ...others
  } = props;

  const excelExportRef = React.useRef<ExcelExport>(null);
  const pdfExportRef = React.useRef<GridPDFExport>(null);

  const [take, setTake] = React.useState(10);
  const [skip, setSkip] = React.useState(0);
  const [sort, setSort] = React.useState<SortDescriptor[]>([]); // Explicitly set type as SortDescriptor[]
  const [group, setGroup] = React.useState<GroupDescriptor[]>([]); // Explicitly set type as GroupDescriptor[]
  const lastSelectedIndexRef = React.useRef(0);
  const [filter, setFilter] = React.useState<
    CompositeFilterDescriptor | undefined
  >(undefined); // Updated initialization
  //const [allColumnFilter, setAllColumnFilter] = React.useState<string>('');

  const dataState: State = { take, skip, sort, group, filter };

  const onDataStateChange = React.useCallback(
    (event: GridDataStateChangeEvent) => {
      setTake(event.dataState.take ?? 10);
      setSkip(event.dataState.skip ?? 0);
      setSort(event.dataState.sort ?? []);
      setGroup(event.dataState.group ?? []);
      setFilter(event.dataState.filter); // Updated callback
    },
    []
  );

  const onExcelExport = React.useCallback(() => {
    excelExportRef.current?.save();
  }, [data]);

  const onPdfExport = React.useCallback(() => {
    pdfExportRef.current?.save();
  }, [data]);

  // const onAllColumnFilterChange = React.useCallback((event: InputChangeEvent) => {
  //     setAllColumnFilter(event.value);
  // }, []);

  const onSelectionChange = React.useCallback(
    (event: GridSelectionChangeEvent) => {
      let last = lastSelectedIndexRef.current;
      const updatedData = data.map((dataItem) => ({ ...dataItem }));
      const current = data.findIndex((dataItem) => dataItem === event.dataItem);

      if (!event.nativeEvent.shiftKey) {
        lastSelectedIndexRef.current = last = current;
      }

      const select = !event.dataItem.selected;
      for (let i = Math.min(last, current); i <= Math.max(last, current); i++) {
        updatedData[i].selected = select;
      }

      onDataChange(updatedData);
    },
    [data, onDataChange]
  );

  const onHeaderSelectionChange = React.useCallback(
    (event: GridHeaderSelectionChangeEvent) => {
      const checked = (event.syntheticEvent.target as HTMLInputElement).checked;
      const updatedData = data.map((item) => ({
        ...item,
        selected: checked,
      }));
      onDataChange(updatedData);
    },
    [data, onDataChange]
  );

  const textColumns = React.Children.toArray(props.children)
    .map(
      (col) => (col as React.ReactElement<{ field: keyof Invoice }>).props.field
    )
    .filter((field) => typeof data[0]?.[field] === "string");

  const allColumnsFilters = textColumns.map((column) => ({
    field: column,
    operator: "contains",
    value: allColumnFilter ? allColumnFilter.toString() : "",
  }));

  const allColumnFilteredData = allColumnFilter
    ? process(data, { filter: { logic: "or", filters: allColumnsFilters } })
        .data
    : data;

  const processedData = process(allColumnFilteredData, dataState);

  React.useEffect(() => {
    if (!processedData.data.length) setSkip(0);
  }, [processedData]);

  const GridElement = (
    <KendoGrid
      {...dataState}
      {...others}
      rowHeight={40}
      pageable={{
        buttonCount: 5,
        info: true,
        type: "numeric",
        pageSizes: [5, 10, 20, 100],
        previousNext: true,
      }}
      sortable
      groupable
      detail={detail}
      expandField={props.expandField}
      onExpandChange={props.onExpandChange}
      selectedField="selected"
      data={processedData}
      onDataStateChange={onDataStateChange}
      onSelectionChange={onSelectionChange}
      onHeaderSelectionChange={onHeaderSelectionChange}
      className="custom-grid-styles"
    >
      {/* <GridToolbar>
                <Input
                    value={allColumnFilter}
                    onChange={onAllColumnFilterChange}
                    placeholder={"Search in all columns..."}
                />
            </GridToolbar> */}
      {!stateHidden && (
        <GridColumn
          field="selected"
          width={50}
          title=" "
          headerSelectionValue={
            data.length > 0 &&
            data.every((dataItem) => dataItem.selected === true)
          }
        />
      )}
      {React.Children.map(props.children, (child) =>
        React.cloneElement(child as React.ReactElement, {
          columnMenu: stateHidden
            ? undefined
            : (props: GridColumnProps) => <ColumnMenu column={props} />,
        })
      )}
      {!stateHidden && (
        <GridColumn
          title=""
          headerCell={() => (
            <div className="align-end">
              <HeaderActionCell
                onExcelExport={onExcelExport}
                onPdfExport={onPdfExport}
              />
            </div>
          )}
          cell={() => (
            <ActionCell
              onExcelExport={onExcelExport}
              onPdfExport={onPdfExport}
            />
          )}
          width="120px"
          //columnMenu={ColumnMenu} // Adding the custom ColumnMenu here
        />
      )}
    </KendoGrid>
  );

  return (
    <>
      <ExcelExport data={processedData.data} ref={excelExportRef}>
        {GridElement}
      </ExcelExport>
      <GridPDFExport ref={pdfExportRef}>{GridElement}</GridPDFExport>
    </>
  );
};
