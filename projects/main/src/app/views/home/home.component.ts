import { Component, OnInit, Input } from '@angular/core';
import { InlineResponse20037 } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Input()
  nodeInfo?: InlineResponse20037 | null;

  @Input()
  syncing?: boolean | null;

  constructor() {}

  ngOnInit(): void {}
}
