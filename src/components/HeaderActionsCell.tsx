"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Popup } from '@progress/kendo-react-popup';
import { Button } from '@progress/kendo-react-buttons';
import ActionMenu from './ActionsMenu';

interface HeaderActionCellProps {
    onExcelExport: () => void;
    onPdfExport: () => void;
}

const HeaderActionCell: React.FC<HeaderActionCellProps> = ({ onExcelExport, onPdfExport }) => {
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
        <div ref={anchorRef} style={{ display: 'inline-block', position: 'relative' }} >
            <Button icon="more-horizontal" onClick={toggleMenu} className="action-menu-button align-end"/>
            {anchorRef.current && (
                <Popup anchor={anchorRef.current} show={showMenu} popupAlign={{ vertical: 'bottom', horizontal: 'right' }}>
                    <div ref={menuRef}>
                        <ActionMenu onExcelExport={onExcelExport} onPdfExport={onPdfExport} />
                    </div>
                </Popup>
            )}
        </div>
    );
};

export default HeaderActionCell;
