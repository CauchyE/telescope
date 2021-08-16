import { Component, Input, OnInit } from '@angular/core';
import { InlineResponse20048Proposals, InlineResponse20050Deposits, InlineResponse20052Tally, InlineResponse20053Votes } from 'cosmos-client/esm/openapi';

@Component({
  selector: 'view-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {
  @Input()
  proposal?: InlineResponse20048Proposals | null;
  @Input()
  deposits?: InlineResponse20050Deposits[] | null;
  @Input()
  tally?: InlineResponse20052Tally | null;
  @Input()
  votes?: InlineResponse20053Votes[] | null;

  constructor() { }

  ngOnInit(): void {
  }

}
