import React from 'react';
import { SvgIcon } from '@progress/kendo-react-common';
import { filePdfIcon, fileExcelIcon, uploadIcon } from '@progress/kendo-svg-icons';

interface ActionMenuProps {
    onExcelExport: () => void;
    onPdfExport: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ onExcelExport, onPdfExport }) => (
    <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={onPdfExport}>
            <SvgIcon icon={filePdfIcon} size="small" />
            <span style={{ marginLeft: '8px' }}>Export To PDF</span>
        </div>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={onExcelExport}>
            <SvgIcon icon={fileExcelIcon} size="small" />
            <span style={{ marginLeft: '8px' }}>Export To Excel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <SvgIcon icon={uploadIcon} size="small" />
            <span style={{ marginLeft: '8px' }}>Import Employees</span>
        </div>
    </div>
);

export default ActionMenu;
