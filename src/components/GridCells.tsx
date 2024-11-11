"use client";

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useInternationalization } from '@progress/kendo-react-intl';
import { Popup } from '@progress/kendo-react-popup';
import { Button } from '@progress/kendo-react-buttons';
//import { Badge } from '@progress/kendo-react-indicators';
//import { SvgIcon } from '@progress/kendo-react-common';
//import { filePdfIcon, fileExcelIcon } from '@progress/kendo-svg-icons';
import ActionMenu from './ActionsMenu';
import { GridCellProps } from '@progress/kendo-react-grid';


interface ActionCellProps extends Partial<GridCellProps> {
    onExcelExport: () => void;
    onPdfExport: () => void;
}

export const ActionCell: React.FC<ActionCellProps> = ({ onExcelExport, onPdfExport }) => {
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
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <td className="align-end">
            <div ref={anchorRef} style={{ display: 'inline-block' }} >
                <Button icon="more-horizontal" onClick={toggleMenu} className="action-menu-button"/>
            </div>
            {anchorRef.current && (
                <Popup anchor={anchorRef.current} show={showMenu} popupAlign={{ vertical: 'bottom', horizontal: 'right' }}>
                    <div ref={menuRef}>
                        <ActionMenu onExcelExport={onExcelExport} onPdfExport={onPdfExport} />
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

export const FullNameCell: React.FC<GridCellProps> = ({ dataItem, rowType }) => {
    if (rowType === 'groupHeader') return null;

    const getInitials = (name: string | undefined) => {
        if (!name) {
            return ''; // Return an empty string or some default value if name is undefined
        }
        const initials = name.split(' ').map((n) => n[0]).join('');
        return initials.toUpperCase();
    };

    const customerPhotoStyle = {
        display: 'inline-block',
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: '#2285D0',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'light',
        textAlign: 'center' as const,
        verticalAlign: 'middle',
        lineHeight: '32px',
        marginLeft: '5px',
    };

    const customerName = {
        display: 'inline-block',
        verticalAlign: 'middle',
        lineHeight: '32px',
        paddingLeft: '10px',
    };

    return (
        <td>
            <div style={customerPhotoStyle}>
                {getInitials(dataItem.contactId)}
            </div>
            <div style={customerName}>{dataItem.contactId}</div>
        </td>
    );
};

// interface DateCellProps {
//     dataItem: { dueDate: Date };
//     rowType?: string;
// }

export const DateCell: React.FC<GridCellProps> = ({ dataItem, rowType }) => {
    if (rowType === 'groupHeader') return null;

    const formatDate = (date: Date) => {
        if (!(date instanceof Date)) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return <td>{formatDate(dataItem.dateCreated)}</td>;
};

// interface CurrencyCellProps {
//     dataItem: { [key: string]: number };
//     field: string;
//     rowType?: string;
// }

export const CurrencyCell: React.FC<GridCellProps> = ({ dataItem, field }) => {
    const intlService = useInternationalization();
    const redBoldStyle = {
        color: '#d9534f',
        fontWeight: 600,
    };

    if (!dataItem || !field || typeof dataItem[field] !== 'number') return null;

    const value = dataItem[field] as number;

    return (
        <td>
            <span style={value < 0 ? redBoldStyle : undefined}>
                {intlService.formatNumber(value, 'c')}
            </span>
        </td>
    );
};
