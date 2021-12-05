import { BaseDisplayItemComponent } from "./base-display-item/base-display-item.component";
import { BaseDisplayItemI, BaseEventOptionsI, BaseColumnFilterI } from "../../table-api";
import { BaseEventComponent } from "../table/base-event/base-event.component";
import { BaseColumnFilterComponent } from "../table/base-column-filter/base-column-filter.component";

export function applyDisplayItemSettings(component: BaseDisplayItemComponent, settings: BaseDisplayItemI) {
    component.config = settings.config;
    component.value = settings.value;
    component.componentRef = settings.componentRef;
    component.processRowData = settings.processRowData;
    setTableEvents(component, settings);
}

export function applyColumnFilterSettings(component: BaseColumnFilterComponent, settings: BaseColumnFilterI) {
    applyDisplayItemSettings(component, settings);
    component.field = settings.field;
    component.selectedValue = settings.selectedValue;
    component.operator = settings.operator;
    component.excludeFilter = settings.excludeFilter;
}

export function setTableEvents(cr: BaseEventComponent, eventCfg: BaseEventOptionsI) {
    cr.processTableCellEvent = eventCfg.processTableCellEvent;
    cr.processCaptionEvent = eventCfg.processCaptionEvent;
    cr.processClearFiltersEvent = eventCfg.processClearFiltersEvent;
    cr.processColumnFilterEvent = eventCfg.processColumnFilterEvent;
    cr.processDisplayItemEvent = eventCfg.processDisplayItemEvent;
    cr.processInputTemplateEvent = eventCfg.processInputTemplateEvent;
    cr.processPopupEvent = eventCfg.processPopupEvent;
    cr.processSortEvent = eventCfg.processSortEvent;
    cr.processTableFilterEvent = eventCfg.processTableFilterEvent;
}