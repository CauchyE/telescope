import { Component, Input, OnInit } from '@angular/core';
import { websocket } from 'cosmos-client';
import { InlineResponse20031 } from 'cosmos-client/esm/openapi';

@Component({
  selector: 'view-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  @Input()
  initialBlock?: InlineResponse20031 | null | undefined;
  @Input()
  latestBlocks?: websocket.ResponseSchema[] | null | undefined;

  constructor() { }

  ngOnInit(): void { }
}
