import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TabViewConfig, ConfigI } from '../../../table-api';
import { BaseComponent } from '../../base/base.component';
import { BaseRowExpansionComponent } from '../../table/base-row-expansion/base-row-expansion.component';
import { TabPanelHeaderDirective } from '../../../directives/tab-view/tab-panel-header.directive';
import { TabPanelContentDirective } from '../../../directives/tab-view/tab-panel-content.directive';

@Component({
    selector: 'lib-base-tab-view',
    templateUrl: './base-tab-view.component.html',
    styleUrls: ['./base-tab-view.component.scss']
})
export abstract class BaseTabViewComponent extends BaseRowExpansionComponent implements OnInit {
    private _openedPanelIdxs: number[] = [];
    private _panelCrs: ComponentRef<BaseComponent>[] = [];
    private _panelHeaderCrs: ComponentRef<ConfigI>[] = [];

    @Input() public config: TabViewConfig
    @ViewChildren(TabPanelContentDirective) public panelContentDirs: QueryList<TabPanelContentDirective>;
    @ViewChildren(TabPanelHeaderDirective) public panelHeaderDirs: QueryList<TabPanelHeaderDirective>;

    public abstract tabChange(any);

    constructor(
        public cdr: ChangeDetectorRef,
        public cfr: ComponentFactoryResolver,
    ) { super() }

    private initTabPanelConfigs() {
        for (let i = 0; i < this.config.panels.length; i++) {
            if (this.config.panels[i].tabPanelConfig == undefined) {
                this.config.panels[i].tabPanelConfig = {};
            }
        }
    }

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
        this.renderCallback.emit(null);
    }

    public ngAfterViewInit() {
        this.initTabView();
        this.cdr.detectChanges();
    }

    public ngOnDestroy() {
        for (let i = 0; i < this._panelCrs.length; i++) {
            this._panelCrs[i].destroy();
        }

        this._panelCrs = null;
    }

}
