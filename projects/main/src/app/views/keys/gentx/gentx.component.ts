import { Key } from '../../../models/keys/key.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface GentxData {
  privateKey: string;
  moniker: string;
  identity: string;
  website: string;
  security_contact: string;
  details: string;
  rate: string;
  max_rate: string;
  max_change_rate: string;
  min_self_delegation: string;
  delegator_address: string;
  validator_address: string;
  denom: string;
  amount: string;
}

@Component({
  selector: 'app-view-gentx',
  templateUrl: './gentx.component.html',
  styleUrls: ['./gentx.component.css'],
})
export class GentxComponent implements OnInit {
  @Input() key?: Key | null;
  @Input() moniker?: string | null;
  @Input() identity?: string | null;
  @Input() website?: string | null;
  @Input() security_contact?: string | null;
  @Input() details?: string | null;
  @Input() rate?: string | null;
  @Input() max_rate?: string | null;
  @Input() max_change_rate?: string | null;
  @Input() min_self_delegation?: string | null;
  @Input() delegator_address?: string | null;
  @Input() validator_address?: string | null;
  @Input() denom?: string | null;
  @Input() amount?: string | null;

  @Output() submitGentx = new EventEmitter<GentxData>();

  constructor() {}

  ngOnInit(): void {}

  async onSubmitGentx(
    privateKey: string,
    moniker: string,
    identity: string,
    website: string,
    security_contact: string,
    details: string,
    rate: string,
    max_rate: string,
    max_change_rate: string,
    min_self_delegation: string,
    delegator_address: string,
    validator_address: string,
    denom: string,
    amount: string,
  ): Promise<void> {
    this.submitGentx.emit({
      privateKey,
      moniker,
      identity,
      website,
      security_contact,
      details,
      rate,
      max_rate,
      max_change_rate,
      min_self_delegation,
      delegator_address,
      validator_address,
      denom,
      amount,
    });
  }
}
