import { MaskConfig, MaterialInputTextConfig } from "../filter-components/material-components/material-input-text/material-input-text.component";

export function setMaterialInputTextConfig(config: any, colIdx: number) {
    if (config == undefined || config == null) {
        throw ('MUST SET INPUT TEXT CONFIG FOR COLUMN INDEX ' + colIdx);
    }

    let cfg: MaterialInputTextConfig = config;

    if (cfg.style == undefined) {
        cfg.style = { 'width': '80%' };
    }
    if (cfg.placeHolder == undefined) {
        cfg.placeHolder = '';
    }
    if (cfg.inputDebounceTime == undefined || cfg.inputDebounceTime <= 0) {
        cfg.inputDebounceTime = 500;
    }

    let mCfg: MaskConfig = {
        maskTemplate: '',
        specialCharacters: [],
        patterns: {},
        prefix: '',
        suffix: '',
        thousandSeparator: ' ',
        decimalMarker: '.',
        dropSpecialCharacters: null,
        hiddenInput: null,
        showMaskTyped: null,
        placeHolderCharacter: null,
        shownMaskExpression: null,
        showTemplate: null,
        clearIfNotMatch: null,
        validation: null,
        separatorLimit: null,
        allowNegativeNumbers: null,
        leadZeroDateTime: null
    }

    if (cfg.maskCfg == undefined) {
        cfg.maskCfg = mCfg;
    } else {
        if (!cfg.maskCfg.specialCharacters) {
            cfg.maskCfg.specialCharacters = mCfg.specialCharacters
        }
        if (!cfg.maskCfg.patterns) {
            cfg.maskCfg.patterns = mCfg.patterns
        }
        if (!cfg.maskCfg.prefix) {
            cfg.maskCfg.prefix = mCfg.prefix
        }
        if (!cfg.maskCfg.suffix) {
            cfg.maskCfg.suffix = mCfg.suffix
        }
        if (!cfg.maskCfg.thousandSeparator) {
            cfg.maskCfg.thousandSeparator = mCfg.thousandSeparator
        }
        if (!cfg.maskCfg.decimalMarker) {
            cfg.maskCfg.decimalMarker = mCfg.decimalMarker
        }
        if (cfg.maskCfg.dropSpecialCharacters == undefined) {
            cfg.maskCfg.dropSpecialCharacters = mCfg.dropSpecialCharacters
        }
        if (cfg.maskCfg.hiddenInput == undefined) {
            cfg.maskCfg.hiddenInput = mCfg.hiddenInput
        }
        if (!cfg.maskCfg.showMaskTyped == undefined) {
            cfg.maskCfg.showMaskTyped = mCfg.showMaskTyped
        }
        if (!cfg.maskCfg.placeHolderCharacter) {
            cfg.maskCfg.placeHolderCharacter = mCfg.placeHolderCharacter
        }
        if (!cfg.maskCfg.shownMaskExpression) {
            cfg.maskCfg.shownMaskExpression = mCfg.shownMaskExpression
        }
        if (cfg.maskCfg.showTemplate == undefined) {
            cfg.maskCfg.showTemplate = mCfg.showTemplate
        }
        if (cfg.maskCfg.clearIfNotMatch == undefined) {
            cfg.maskCfg.clearIfNotMatch = mCfg.clearIfNotMatch
        }
        if (cfg.maskCfg.validation == undefined) {
            cfg.maskCfg.validation = mCfg.validation
        }
        if (!cfg.maskCfg.separatorLimit) {
            cfg.maskCfg.separatorLimit = mCfg.separatorLimit
        }
        if (cfg.maskCfg.allowNegativeNumbers == undefined) {
            cfg.maskCfg.allowNegativeNumbers = mCfg.allowNegativeNumbers
        }
        if (cfg.maskCfg.leadZeroDateTime == undefined) {
            cfg.maskCfg.leadZeroDateTime = mCfg.leadZeroDateTime
        }
    }

    config = cfg;
}

// @Component({
//     template: '',
// })
// export class BaseMaterialDropdownSelectComponent extends BaseColumnItems {
//     @ViewChildren('selectAll') public selectAll: MatOption;
//     @ViewChildren(MatOptionDirective) public options: QueryList<MatOptionDirective>;

//     public cfg: MaterialDropdownSelectConfig;

//     constructor() {
//         super();
//     }

//     private initConfig() {
//         if (this.config == undefined) {
//             throw ('MUST SET MATERIAL DROPDOWN SELECT CONFIG FOR COL IDX ' + this.colIdx);
//         } else {
//             this.cfg = this.config;

//             if (this.cfg.selectAllLabel == undefined) {
//                 this.cfg.selectAllLabel = '--Select All--'
//             }
//         }
//     }

//     private removeNulls(vals: any[]): any[] {
//         let i = vals.length;

//         while (i--) {
//             if (vals[i] == undefined || vals[i] == null) {
//                 vals.splice(i, 1);
//             }
//         }

//         return vals
//     }

//     public ngOnInit(): void {
//         this.initConfig();
//     }

//     public toggle() {
//         let sEvent: MaterialDropdownSelectEvent = {
//             isSelectAll: false
//         }
//         let event: BaseTableEvent = {
//             eventFieldName: this.cfg.eventFieldName,
//             event: sEvent,
//         }

//         if (this.selectAll && this.selectAll.selected) {
//             this.selectAll.deselect();
//         } else if (this.selectedValue && this.selectedValue.length == this.value.length) {
//             this.selectAll.select();
//             let vals = this.selectedValue as any[];
//             vals = this.removeNulls(vals);
//         }
//         this.onChangeEvent(event);
//     }

//     public toggleAll() {
//         let sEvent: MaterialDropdownSelectEvent = {
//             isSelectAll: true
//         }
//         let event: BaseTableEvent = {
//             eventFieldName: this.cfg.eventFieldName,
//             event: sEvent
//         }

//         this.options.forEach(x => {
//             if (this.selectAll.selected) {
//                 x.viewContainerRef.select();
//             } else {
//                 x.viewContainerRef.deselect();
//             }
//         })

//         let vals = this.selectedValue as any[];
//         vals = this.removeNulls(vals);
//         this.onChangeEvent(event);
//     }
// }