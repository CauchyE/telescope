import { Component, OnInit, Input } from '@angular/core';
import { InlineResponse20033 } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Input()
  nodeInfo?: InlineResponse20033 | null;

  @Input()
  syncing?: boolean | null;

  constructor() {}

  ngOnInit(): void {}
}
