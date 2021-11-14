import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TabViewConfig, ConfigI } from '../../../table-api';
import { BaseComponent } from '../../base/base.component';
import { TabPanelHeaderDirective } from '../../../directives/tab-view/tab-panel-header.directive';
import { TabPanelContentDirective } from '../../../directives/tab-view/tab-panel-content.directive';
import { BaseEventComponent } from '../base-event/base-event.component'

// BaseTabViewComponent should be extended by component that has a tab view
@Component({
    selector: 'lib-base-tab-view',
    templateUrl: './base-tab-view.component.html',
    styleUrls: ['./base-tab-view.component.scss']
})
export abstract class BaseTabViewComponent extends BaseEventComponent implements OnInit {
    // _openedPanelIdxs keeps track of all tabs that have already been opended
    // This is used to keep track of which tabs have already rendered dynamic
    // components to avoid re-rendering
    private _openedPanelIdxs: number[] = [];

    // _panelCrs keeps references to all dynamically created panel content components
    private _panelCrs: ComponentRef<BaseComponent>[] = [];

    // _panelHeaderCrs keeps references to all dynamically created panel header components
    private _panelHeaderCrs: ComponentRef<ConfigI>[] = [];

    // config is config used for component
    @Input() public config: TabViewConfig;

    // panelContentDirs is list of directives to dynamically generate components for panel content
    @ViewChildren(TabPanelContentDirective) public panelContentDirs: QueryList<TabPanelContentDirective>;

    // panelHeaderDirs is list of directives to dynamically generate components for panel header
    @ViewChildren(TabPanelHeaderDirective) public panelHeaderDirs: QueryList<TabPanelHeaderDirective>;

    // onTabChange should be responsible for rendering the newly selected tab panel content
    public abstract onTabChange(any);

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { super() }

    // initTabPanelConfigs loops through panels of config and sets to empty object if undefined
    private initTabPanelConfigs() {
        for (let i = 0; i < this.config.panels.length; i++) {
            if (this.config.panels[i].tabPanelConfig == undefined) {
                this.config.panels[i].tabPanelConfig = {};
            }
        }
    }

    // createPanelComponent will take panel content directive and generate dynamic panel component
    private createPanelComponent(dir: TabPanelContentDirective) {
        const cr = dir.viewContainerRef.createComponent(
            this.cfr.resolveComponentFactory(
                this.config.panels[dir.tabIdx].panelEntity.component,
            )
        );
        cr.instance.config = this.config.panels[dir.tabIdx].panelEntity.config;
        cr.instance.outerData = this.outerData;
        cr.instance.componentRef = this.componentRef;
        this._panelCrs.push(cr);
    }

    // initTabView takes the panel header and panel content directives and 
    // loops through them to dynamically create panel header and panel content
    private initTabView() {
        this.panelHeaderDirs.forEach(dir => {
            const cr = dir.viewContainerRef.createComponent(
                this.cfr.resolveComponentFactory(
                    this.config.panels[dir.tabIdx].headerEntity.component
                )
            );
            cr.instance.config = this.config.panels[dir.tabIdx].headerEntity.config;
            this._panelHeaderCrs.push(cr);
        })

        this.panelContentDirs.forEach((dir) => {
            if (
                this.config.selectedIdx == dir.tabIdx &&
                this.config.panels[dir.tabIdx].panelEntity != undefined
            ) {
                this._openedPanelIdxs.push(dir.tabIdx)
                this.createPanelComponent(dir)
            }
        });
    }

    // openTab should be used by extended class to give index of which tab to open/render
    protected openTab(idx: number) {
        let found = false;

        for (let i = 0; i < this._openedPanelIdxs.length; i++) {
            if (this._openedPanelIdxs[i] == idx) {
                found = true;
                break
            }
        }

        if (!found) {
            //console.log('creating due to not found');
            this._openedPanelIdxs.push(idx);
            this.createPanelComponent(this.panelContentDirs.toArray()[idx])
            this.cdr.detectChanges();
        }
    }

    public ngOnInit(): void {
        this.initTabPanelConfigs();
    }

    public ngAfterViewInit() {
        this.initTabView();
        this.cdr.detectChanges();
    }

    public ngOnDestroy() {
        for (let i = 0; i < this._panelCrs.length; i++) {
            this._panelCrs[i].destroy();
        }
        for (let i = 0; i < this._panelHeaderCrs.length; i++) {
            this._panelHeaderCrs[i].destroy();
        }

        this._panelCrs = null;
        this._panelHeaderCrs = null;
    }

}
