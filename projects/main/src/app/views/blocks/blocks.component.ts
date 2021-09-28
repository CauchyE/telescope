import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { InlineResponse20032 } from 'cosmos-client/esm/openapi';

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
  paginationChange:EventEmitter<PageEvent>;

  constructor() {
    this.paginationChange = new EventEmitter;
  }

  ngOnInit(): void {
  }

  onPaginationChange(pageEvent: PageEvent): void {
    this.paginationChange.emit(pageEvent);
  }

}
