// GridSearchToolbar.tsx

import React from 'react';
import { GridToolbar } from '@progress/kendo-react-grid';
import { Input, InputChangeEvent } from '@progress/kendo-react-inputs';

interface GridSearchToolbarProps {
    allColumnFilter: string;
    onAllColumnFilterChange: (event: InputChangeEvent) => void;
}

export const GridSearchToolbar: React.FC<GridSearchToolbarProps> = ({ allColumnFilter, onAllColumnFilterChange }) => (
    <GridToolbar>
        <Input
            value={allColumnFilter}
            onChange={onAllColumnFilterChange}
            placeholder={"Search in all columns..."}
            className="border-none search-bar-2"
        />
    </GridToolbar>
);
