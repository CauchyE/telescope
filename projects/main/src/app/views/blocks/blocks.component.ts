import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { InlineResponse20032 } from 'cosmos-client/esm/openapi';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'view-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css']
})
export class BlocksComponent implements OnInit {
  @Input()
  latestBlocks?: InlineResponse20032[] | null;

  @Input()
  pageSizeOptions?: number[]| null;

  @Input()
  pageSize?: number | null;

  @Input()
  pageNumber?: number | null;

  @Input()
  pageLength?: number | null;

  @Output()
  pagenationChange:EventEmitter<PageEvent>;

  constructor() {
    this.pagenationChange = new EventEmitter;
  }

  ngOnInit(): void {
  }

  onPagenationChange(pageEvent: PageEvent): void {
    this.pagenationChange.emit(pageEvent);
  }

}
