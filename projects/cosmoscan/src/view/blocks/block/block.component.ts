import { Component, Input, OnInit } from '@angular/core';
import { InlineResponse20032 } from 'cosmos-client/esm/openapi';

@Component({
  selector: 'view-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent implements OnInit {
  @Input()
  block?: InlineResponse20032 | null;

  constructor() { }

  ngOnInit(): void {
  }

}
