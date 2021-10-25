import { Component, Input, OnInit } from '@angular/core';
import { InlineResponse20052 } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css'],
})
export class ProposalsComponent implements OnInit {
  @Input()
  proposals?: InlineResponse20052 | null;

  constructor() {}

  ngOnInit(): void {}
}
