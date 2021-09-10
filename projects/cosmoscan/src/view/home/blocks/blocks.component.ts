import { Component, Input, OnInit } from '@angular/core';
import { InlineResponse20032 } from 'cosmos-client/esm/openapi';

@Component({
  selector: 'view-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  @Input()
  latestBlocks?: InlineResponse20032[] | null | undefined;

  constructor() { }

  ngOnInit(): void { }
}
