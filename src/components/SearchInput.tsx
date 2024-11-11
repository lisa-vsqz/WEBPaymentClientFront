// src/components/SearchInput.tsx
import React from 'react';
import { Input, InputChangeEvent } from '@progress/kendo-react-inputs';

interface SearchInputProps {
    value: string;
    onChange: (event: InputChangeEvent) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
    return (
        <Input
            value={value}
            onChange={onChange}
            placeholder="Search in all columns..."
            className="border-none search-bar-2"
        />
    );
};

export default SearchInput;
