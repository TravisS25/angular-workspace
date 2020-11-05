import { Component, OnInit, Input, EventEmitter, OnDestroy } from '@angular/core';
import { BaseTableComponent } from '../base-table/base-table.component';
import { Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpClient } from '@angular/common/http';
import { BaseCaptionItems } from '../../table-api';

@Component({
  selector: 'app-base-caption',
  templateUrl: './base-caption.component.html',
  styleUrls: ['./base-caption.component.scss']
})
export class BaseCaptionComponent extends BaseCaptionItems implements OnInit, OnDestroy {
  constructor() { 
    super();
  }

  public ngOnInit(): void {
    
  }

}
