import { CreateValidatorData } from '../../../../models/cosmos/staking.model';
import { Key } from '../../../../models/keys/key.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-view-create-validator',
  templateUrl: './create-validator.component.html',
  styleUrls: ['./create-validator.component.css'],
})
export class CreateValidatorComponent implements OnInit {
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
  @Input() ip?: string | null;
  @Input() node_id?: string | null;
  @Input() pubkey?: string | null;

  @Output() submitCreateValidator = new EventEmitter<CreateValidatorData>();

  constructor() {}

  ngOnInit(): void {}

  async onSubmitCreateValidator(
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
    ip: string,
    node_id: string,
    pubkey: string,
  ): Promise<void> {
    this.submitCreateValidator.emit({
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
      ip,
      node_id,
      pubkey,
    });
  }
}
