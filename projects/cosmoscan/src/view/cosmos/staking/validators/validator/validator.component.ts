import { Component, OnInit, Input } from '@angular/core';
import { InlineResponse20063Validator } from 'cosmos-client/openapi/api';

@Component({
  selector: 'view-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css'],
})
export class ValidatorComponent implements OnInit {
  @Input()
  validator?: InlineResponse20063Validator | null;

  constructor() { }

  ngOnInit(): void { }
}
