import { Component, OnInit, Input } from '@angular/core';
import { QueryValidatorResponseIsResponseTypeForTheQueryValidatorRPCMethod } from 'cosmos-client/openapi/api';

@Component({
  selector: 'view-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css'],
})
export class ValidatorComponent implements OnInit {
  @Input()
  validator?: QueryValidatorResponseIsResponseTypeForTheQueryValidatorRPCMethod | null;

  constructor() { }

  ngOnInit(): void { }
}
