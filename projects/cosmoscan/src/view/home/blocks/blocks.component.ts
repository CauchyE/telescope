import { Component, Input, OnInit } from '@angular/core';
import { websocket } from 'cosmos-client';

@Component({
  selector: 'view-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  @Input()
  latestBlocks?: websocket.ResponseSchema[] | null | undefined;

  constructor() { }

  ngOnInit(): void { }
}
