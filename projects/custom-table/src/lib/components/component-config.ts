import { SelectItem } from 'primeng/api';
import { BaseTableEventConfig } from '../table-api';

export interface FilterConfig {
    // type determines the icon that will be displayed
    type: 'textInput' | 'date',

    // options determines what list of values will be displayed for filter
    // along with ability to select default value
    options: FilterOptions;
}

// FilterOptions display filter options and ability to choose default option
export interface FilterOptions {
    // values is list of values to display
    values: SelectItem[];

    // selectValue is default value selected 
    selectedValue: any
}

export interface CheckboxEvent {
    colIdx?: number;
    rowIdx?: number;
    rowData?: any;
    checked?: boolean;
    isHeaderCheckbox?: boolean;
}

export interface MaterialCheckboxConfig extends BaseTableEventConfig {
    color?: any;
    disableRipple?: boolean;
    disabled?: boolean;
    id?: string;
    indeterminate?: boolean;
    labelPosition?: 'left' | 'right',
    name?: string;
    required?: boolean;
    value?: string;
}